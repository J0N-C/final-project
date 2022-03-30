set client_min_messages to warning;


-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.

drop schema "public" cascade;

create schema "public";

set time zone 'PST8PDT';

CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "recipes" (
	"recipeId" serial NOT NULL,
	"name" TEXT NOT NULL,
  -- DELETE INGREDIENTS COLUMN AND REPLACE IN FUTURE, THIS IS FOR TEMP TESTING
  "ingredients" TEXT NOT NULL,
	"instructions" TEXT NOT NULL,
	"notes" TEXT DEFAULT NULL,
	"saved" TIMESTAMPTZ NOT NULL default now(),
	"lastMade" TIMESTAMPTZ default null,
	"lastEdited" TIMESTAMPTZ DEFAULT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "recipes_pk" PRIMARY KEY ("recipeId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "pictures" (
	"pictureId" serial NOT NULL,
	"url" TEXT NOT NULL,
	"recipeId" integer NOT NULL,
	CONSTRAINT "pictures_pk" PRIMARY KEY ("pictureId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "ingredients" (
	"ingredientId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	CONSTRAINT "ingredients_pk" PRIMARY KEY ("ingredientId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "recipeIngredients" (
	"recipeId" integer NOT NULL,
	"ingredientId" integer NOT NULL,
	"amount" TEXT DEFAULT NULL,
	"preparation" TEXT DEFAULT NULL,
	CONSTRAINT "recipeIngredients_pk" PRIMARY KEY ("recipeId","ingredientId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "tags" (
	"tagId" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
  "lastUsed" TIMESTAMPTZ not null default now(),
	CONSTRAINT "tags_pk" PRIMARY KEY ("tagId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "recipeTags" (
	"recipeId" integer NOT NULL,
	"tagId" integer NOT NULL,
	CONSTRAINT "recipeTags_pk" PRIMARY KEY ("recipeId","tagId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "recipes" ADD CONSTRAINT "recipes_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_fk0" FOREIGN KEY ("recipeId") REFERENCES "recipes"("recipeId");
ALTER TABLE "recipeIngredients" ADD CONSTRAINT "recipeIngredients_fk0" FOREIGN KEY ("recipeId") REFERENCES "recipes"("recipeId");
ALTER TABLE "recipeIngredients" ADD CONSTRAINT "recipeIngredients_fk1" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("ingredientId");
ALTER TABLE "recipeTags" ADD CONSTRAINT "recipeTags_fk0" FOREIGN KEY ("recipeId") REFERENCES "recipes"("recipeId");
ALTER TABLE "recipeTags" ADD CONSTRAINT "recipeTags_fk1" FOREIGN KEY ("tagId") REFERENCES "tags"("tagId");
