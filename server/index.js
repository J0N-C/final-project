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

app.post('/api/addrecipe', (req, res, next) => {
  // REPLACE USERID!!! Testing as 1 with dummy user
  const {
    name,
    ingredients,
    instructions,
    notes
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
        res.status(201).json(result);
      })
      .catch(err => next(err))
  );
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
