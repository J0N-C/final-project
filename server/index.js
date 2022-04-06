require('dotenv/config');
const express = require('express');
const pg = require('pg');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
// Testing dummy user 1
const dummyUser = 1;

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.get('/api/recipes', (req, res, next) => {
  // REPLACE USERID!!! Testing as 1 with dummy user
  const sql = `
    select "r"."name",
      "r"."recipeId",
      "r"."instructions",
      "r"."notes",
      "r"."saved",
      "r"."lastMade",
      "r"."lastEdited",
      array_agg (distinct "recipeIngredients"."amount" || ' /ingSplit ' || "ingredients"."name"
                || ' /ingSplit ' || "recipeIngredients"."preparation" || ' /ingSplit ' ||
                "recipeIngredients"."ingredientId")
                as "ingredients",
      array_agg (distinct "pictures"."url") as "images",
      array_agg (distinct "tags"."name") as "tags"
    from  "recipes" as "r"
    left join "recipeTags" using ("recipeId")
    left join "tags" using ("tagId")
    left join "pictures" using ("recipeId")
    join "recipeIngredients" using ("recipeId")
    join "ingredients" using ("ingredientId")
    where "userId" = $1
    group by "recipeId"
    `;
  const params = [dummyUser];
  db.query(sql, params)
    .then(result => {
      const recipes = [...result.rows];
      result.rows.forEach(recipe => {
        const newIngList = recipe.ingredients.map(ingredient => {
          const ingsArr = ingredient.split(' /ingSplit ');
          return { amount: ingsArr[0], name: ingsArr[1], prep: ingsArr[2], ingredientId: ingsArr[3] };
        });
        recipe.ingredients = newIngList;
      });
      res.status(200).json(recipes);
    })
    .catch(err => next(err));
});

app.post('/api/addrecipe', (req, res, next) => {
  // REPLACE USERID!!! Testing as 1 with dummy user
  const {
    name,
    image,
    ingredients,
    instructions,
    notes,
    tags,
    tagCount
  } = req.body.recipe;
  if (!name || ingredients.length < 1 || !instructions) {
    throw new ClientError(400, 'name, ingredients, and instructions are required fields');
  }
  const sql = `
    insert into "recipes" ("userId", "name", "instructions", "notes")
    values ($1, $2, $3, $4)
    returning *
    `;
  const params = [dummyUser, name, instructions, notes];
  return (
    db.query(sql, params)
      .then(result => {
        const [newRecipe] = result.rows;
        const imageSql = `
          insert into "pictures" ("recipeId", "url")
          values ($1, $2)
          returning *
          `;
        const imageParams = [newRecipe.recipeId, image];
        db.query(imageSql, imageParams)
          .then(imgResult => {
            const ingredientValues = [];
            const ingredientNames = [...new Set(ingredients.map(ingredient => {
              return ingredient.name;
            }))];
            for (let i = 1; i <= ingredientNames.length; i++) {
              ingredientValues.push(`($${i})`);
            }
            const ingredientSql = `
              insert into "ingredients" ("name")
              values ${ingredientValues.join(', ')}
              on conflict ("name")
              do update set "lastUsed" = now()
              returning *
              `;
            db.query(ingredientSql, ingredientNames)
              .then(ingredientsResult => {
                const returnedIngredients = ingredientsResult.rows;
                const ingredientsWithIds = ingredients.map(ingredient => {
                  ingredient.ingredientId = returnedIngredients.find(i => i.name === ingredient.name).ingredientId;
                  return [ingredient.ingredientId, ingredient.amount, ingredient.prep];
                });
                const recipeIngredientValues = [];
                let v = 2;
                for (let i = 1; i <= ingredientsWithIds.length; i++) {
                  recipeIngredientValues.push(`($1, $${v}, $${v + 1}, $${v + 2})`);
                  v += 3;
                }
                const recipeIngredientSql = `
                  insert into "recipeIngredients" ("recipeId", "ingredientId", "amount", "preparation")
                  values ${recipeIngredientValues}
                  returning *
                  `;
                const riParams = [newRecipe.recipeId].concat(ingredientsWithIds.flat());
                db.query(recipeIngredientSql, riParams)
                  .then(riResult => {
                    const tagValues = [];
                    if (tagCount > 0) {
                      for (let i = 1; i <= tagCount; i++) {
                        tagValues.push(`($${i})`);
                      }
                      const newTag = `
                        insert into "tags" ("name")
                        values ${tagValues.join(', ')}
                        on conflict ("name")
                        do update set "lastUsed" = now()
                        returning *
                        `;
                      const params2 = tags;
                      db.query(newTag, params2)
                        .then(tagResult => {
                          const newTags = tagResult.rows.map(obj => obj.tagId);
                          const recipeTagValues = [];
                          for (let i = 2; i <= tagCount + 1; i++) {
                            recipeTagValues.push(`($1, $${i})`);
                          }
                          const updateRecipeTags = `
                            insert into "recipeTags" ("recipeId", "tagId")
                            values ${recipeTagValues}
                            returning *
                            `;
                          const recipeTagParams = [newRecipe.recipeId].concat(newTags);
                          db.query(updateRecipeTags, recipeTagParams)
                            .then(recipeTagResult => {
                              res.status(201).json(newRecipe);
                            })
                            .catch(err => next(err));
                        })
                        .catch(err => next(err));
                    } else res.status(201).json(newRecipe);
                  })
                  .catch(err => next(err));
              })
              .catch(err => next(err));
          })
          .catch(err => next(err));
      })
      .catch(err => next(err))
  );
});

app.put('/api/made-this/:recipeId', (req, res, next) => {
  const sql = `
    update "recipes"
      set "lastMade" = now()
    where "recipeId" = ($1)
    returning *
    `;
  const params = [Number(req.params.recipeId)];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(err => next(err));
});

app.put('/api/editrecipe', (req, res, next) => {
  const {
    recipeId,
    name,
    image,
    ingredients,
    instructions,
    notes,
    tags,
    tagCount
  } = req.body.recipe;
  const resetIng = `
    delete from "recipeIngredients"
    where "recipeId" = ${recipeId}
    `;
  db.query(resetIng)
    .then(result => {
      const ingredientValues = [];
      const ingredientNames = [...new Set(ingredients.map(ingredient => {
        return ingredient.name;
      }))];
      for (let i = 1; i <= ingredientNames.length; i++) {
        ingredientValues.push(`($${i})`);
      }
      const ingredientSql = `
        insert into "ingredients" ("name")
        values ${ingredientValues.join(', ')}
        on conflict ("name")
        do update set "lastUsed" = now()
        returning *
        `;
      db.query(ingredientSql, ingredientNames)
        .then(ingredientsResult => {
          const returnedIngredients = ingredientsResult.rows;
          const ingredientsWithIds = ingredients.map(ingredient => {
            ingredient.ingredientId = returnedIngredients.find(i => i.name === ingredient.name).ingredientId;
            return [ingredient.ingredientId, ingredient.amount, ingredient.prep];
          });
          const recipeIngredientValues = [];
          let v = 2;
          for (let i = 1; i <= ingredientsWithIds.length; i++) {
            recipeIngredientValues.push(`($1, $${v}, $${v + 1}, $${v + 2})`);
            v += 3;
          }
          const recipeIngredientSql = `
            insert into "recipeIngredients" ("recipeId", "ingredientId", "amount", "preparation")
            values ${recipeIngredientValues}
            returning *
            `;
          const riParams = [recipeId].concat(ingredientsWithIds.flat());
          db.query(recipeIngredientSql, riParams)
            .then(riResult => {
              const updateSql = `
                update "recipes"
                   set "name" = ($1),
                        "instructions" = ($2),
                        "notes" = ($3),
                        "lastEdited" = now()
                where "recipeId" = ${recipeId}
                returning *
                `;
              const updateParams = [name, instructions, notes];
              db.query(updateSql, updateParams)
                .then(updateResult => {
                  const [updatedRecipe] = updateResult.rows;
                  updatedRecipe.ingredients = [...ingredients];
                  updatedRecipe.images = [image];
                  updatedRecipe.tags = [...tags];
                  const imageSql = `
                    update "pictures"
                       set "url" = ($1)
                    where "recipeId" = ${recipeId}
                    returning *
                    `;
                  const imageParams = [image];
                  db.query(imageSql, imageParams)
                    .then(imageUpdateResult => {
                      const resetTags = `
                        delete from "recipeTags"
                        where "recipeId" = ${recipeId}
                        `;
                      db.query(resetTags)
                        .then(tagResetResult => {
                          const tagValues = [];
                          if (tagCount > 0 && tags[0]) {
                            for (let i = 1; i <= tagCount; i++) {
                              tagValues.push(`($${i})`);
                            }
                            const newTag = `
                              insert into "tags" ("name")
                              values ${tagValues.join(', ')}
                              on conflict ("name")
                              do update set "lastUsed" = now()
                              returning *
                              `;
                            const params2 = tags;
                            db.query(newTag, params2)
                              .then(tagResult => {
                                const newTags = tagResult.rows.map(obj => obj.tagId);
                                const recipeTagValues = [];
                                for (let i = 2; i <= tagCount + 1; i++) {
                                  recipeTagValues.push(`($1, $${i})`);
                                }
                                const updateRecipeTags = `
                                  insert into "recipeTags" ("recipeId", "tagId")
                                  values ${recipeTagValues}
                                  returning *
                                  `;
                                const recipeTagParams = [recipeId].concat(newTags);
                                db.query(updateRecipeTags, recipeTagParams)
                                  .then(recipeTagResult => {
                                    res.status(201).json(updatedRecipe);
                                  })
                                  .catch(err => next(err));
                              })
                              .catch(err => next(err));
                          } else res.status(201).json(updatedRecipe);
                        })
                        .catch(err => next(err));
                    })
                    .catch(err => next(err));
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
