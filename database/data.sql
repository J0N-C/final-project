insert into "users"
  ("firstName", "lastName", "email", "hashedPassword")
  values
    ('Bender', 'Rodriguez', 'bending@planetexpress.com', '$argon2i$v=19$m=4096,t=3,p=1$x4jRxOB+u5Wx5Bhcbtihkg$+jTaL+X8j+IKA2o9mwbBTzEg3oxP7tvzvGkhP7DkKuU');

insert into "recipes"
  ("userId", "name", "instructions", "notes")
  values
    (1, 'Cheeseburger', E'Assemble:\nbottom bun\nmayo\npatty\ncheese\nonion\ntomato\nlettuce\nketchup\nmustard\npickles\ntop bun', 'test recipe');

insert into "ingredients"
  ("name")
  values
    ('beef patty'),
    ('cheese'),
    ('white wheat bun'),
    ('tomato'),
    ('onion'),
    ('lettuce'),
    ('pickles'),
    ('mayo'),
    ('ketchup'),
    ('mustard');

insert into "pictures"
  ("url", "recipeId")
  values
    ('https://i.imgur.com/cwifOWe.jpeg', 1);

insert into "recipeIngredients"
  ("recipeId", "ingredientId", "amount", "preparation")
  values
  (1, 1, '1', ''),
  (1, 2, '1', 'slice'),
  (1, 3, '1', ''),
  (1, 4, '1', 'slice'),
  (1, 5, '1', 'slice'),
  (1, 6, '1', 'leaf'),
  (1, 7, '2', 'slices'),
  (1, 8, '', 'to taste'),
  (1, 9, '', 'to taste'),
  (1, 10, '', 'to taste');

insert into "tags"
  ("name")
  values
  ('beef'),
  ('dairy'),
  ('burger');

  insert into "recipeTags"
    ("recipeId", "tagId")
    values
    (1, 1),
    (1, 2),
    (1, 3);
