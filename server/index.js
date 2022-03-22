require('dotenv/config');
const express = require('express');
const pg = require('pg');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

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
  const placeholderUser = 1;
  const sql = `
  select "r"."name",
    "r"."recipeId",
    "r"."ingredients",
    "r"."instructions",
    "r"."notes",
    "r"."saved",
    "r"."lastMade",
    "r"."lastEdited",
    "tags"."name" as "tags"
    from  "recipes" as "r"
    join "recipeTags" using ("recipeId")
    join "tags" using ("tagId")
    where "userId" = $1
  `;
  const params = [placeholderUser];
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
    tags
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
  const params = [1, name, ingredients, instructions, notes];
  return (
    db.query(sql, params)
      .then(result => {
        const [newRecipe] = result.rows;
        const sql2 = `
          insert into "tags" ("name")
          values ($1)
          returning *
          `;
        const params2 = [tags];
        db.query(sql2, params2)
          .then(result2 => {
            const [newTag] = result2.rows;
            const sql3 = `
            insert into "recipeTags" ("recipeId", "tagId")
            values ($1, $2)
            returning *
            `;
            const params3 = [newRecipe.recipeId, newTag.tagId];
            db.query(sql3, params3)
              .then(result3 => {
                res.status(201).json(result3);
              })
              .catch(err => next(err));
          })
          .catch(err => next(err));
      })
      .catch(err => next(err))
  );
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
