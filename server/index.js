require('dotenv/config');
const express = require('express');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const authorizationMiddleware = require('./authorization-middleware');
// For Testing: User fake@testmail.com, password Fakepass123
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

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password, firstName, lastName } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("email", "hashedPassword", "firstName", "lastName")
        values ($1, $2, $3, $4)
        returning "userId", "email", "firstName", "lastName", "createdAt"
      `;
      const params = [username, hashedPassword, firstName, lastName];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "email" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.get('/api/recipes', (req, res, next) => {
  const { userId } = req.user;
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
  const params = [userId];
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
  const { userId } = req.user;
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
  const params = [userId, name, instructions, notes];
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

app.delete('/api/delete-recipe/:recipeId', (req, res, next) => {
  const recipeId = Number(req.params.recipeId);
  const deleteRecipeIngSql = `
    delete from "recipeIngredients"
    where "recipeId" = ($1)
    `;
  const params = [recipeId];
  db.query(deleteRecipeIngSql, params)
    .then(result1 => {
      const deleteTagSql = `
        delete from "recipeTags"
        where "recipeId" = ($1)
        `;
      db.query(deleteTagSql, params)
        .then(result2 => {
          const deleteImgSql = `
            delete from "pictures"
            where "recipeId" = ($1)
            `;
          db.query(deleteImgSql, params)
            .then(result3 => {
              const deleteRecipeSql = `
                delete from "recipes"
                where "recipeId" = ($1)
                `;
              db.query(deleteRecipeSql, params)
                .then(result4 => {
                  res.status(200).json({ deleted: recipeId });
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
