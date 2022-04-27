insert into "users"
  ("firstName", "lastName", "email", "hashedPassword")
  values
    ('Bender', 'Rodriguez', 'fake@testmail.com', '$argon2i$v=19$m=4096,t=3,p=1$x4jRxOB+u5Wx5Bhcbtihkg$+jTaL+X8j+IKA2o9mwbBTzEg3oxP7tvzvGkhP7DkKuU');

insert into "recipes"
  ("userId", "name", "instructions", "notes")
  values
    (1, 'Cheeseburger', E'Cook patties on pan\nAssemble: bottom bun, nmayo, patty, cheese, onion, tomato, lettuce, ketchup, mustard, pickles, top bun\nEnjoy', 'test recipe');

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


insert into "recipes"
  ("userId", "name", "instructions", "notes")
  values
    (1, 'Guacamole', E'Split avocadoes in half, discard pits, scoop out avocadoes into bowl with onions, cilantro, and chiles\nJuice 2 limes into bowl\nFold ingredients together in bowl, add salt to taste.', 'test recipe from Serious Eats');

insert into "ingredients"
  ("name")
  values
    ('avocadoes'),
    ('serrano chile'),
    ('cilantro'),
    ('salt'),
    ('limes');

insert into "pictures"
  ("url", "recipeId")
  values
    ('https://i.imgur.com/toSH7qV.jpeg', 2);

insert into "recipeIngredients"
  ("recipeId", "ingredientId", "amount", "preparation")
  values
  (2, 11, '4', ''),
  (2, 5, '1', 'diced'),
  (2, 12, '1', 'diced'),
  (2, 13, '1/2 cup', ''),
  (2, 14, '', 'to taste'),
  (2, 15, '2', '');

insert into "tags"
  ("name")
  values
  ('vegan');

  insert into "recipeTags"
    ("recipeId", "tagId")
    values
    (2, 4);
