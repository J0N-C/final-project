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
      "r"."ingredients",
      "r"."instructions",
      "r"."notes",
      "r"."saved",
      "r"."lastMade",
      "r"."lastEdited",
      array_agg ("tags"."name") as "tags"
    from  "recipes" as "r"
    left join "recipeTags" using ("recipeId")
    left join "tags" using ("tagId")
    where "userId" = $1
    group by "recipeId"
    `;
  const params = [dummyUser];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/addrecipe', (req, res, next) => {
  // REPLACE USERID!!! Testing as 1 with dummy user
  const {
    name,
    ingredients,
    instructions,
    notes,
    tags,
    tagCount
  } = req.body.recipe;
  if (!name || !ingredients || !instructions) {
    throw new ClientError(400, 'name, ingredients, and instructions are required fields');
  }
  const sql = `
    insert into "recipes" ("userId", "name", "ingredients", "instructions", "notes")
    values ($1, $2, $3, $4, $5)
    returning *
    `;
  // Testing dummy user 1
  const params = [dummyUser, name, ingredients, instructions, notes];
  return (
    db.query(sql, params)
      .then(result => {
        const newRecipe = result.rows;
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
              const recipeTagParams = [dummyUser].concat(newTags);
              db.query(updateRecipeTags, recipeTagParams)
                .then(recipeTagResult => {
                  res.status(201).json(recipeTagResult);
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        }
        res.status(201).json(newRecipe);
      })
      .catch(err => next(err))
  );
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
