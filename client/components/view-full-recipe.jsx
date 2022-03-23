import React from 'react';
import checkDate from './checkdate';

function splitLines(array) {
  return (
    array.map((item, i) => {
      return <li key={i}>{item}</li>;
    })
  );
}

export default function FullRecipe(props) {
  const recipe = props.recipe;
  if (!recipe) {
    return (
      <>
        <p>loading...</p>
      </>
    );
  }
  const ingredients = (recipe.ingredients.split('\n'));
  const instructions = (recipe.instructions.split('\n'));

  return (
    <div id={recipe.recipeId} className="recipe-card-full box-shadow">
      <div className="card-title">
        <h2>{recipe.name}</h2>
      </div>
      <div className="full-card-content">
        <div className="image-preview">

        </div>
        <div className="full-card-content">
          <h4>INGREDIENTS:</h4>
          <ul>
            {splitLines(ingredients)}
          </ul>
          <h4>INSTRUCTIONS:</h4>
          <ul>
            {splitLines(instructions)}
          </ul>
          <h4>NOTES:</h4>
          <p>{recipe.notes}</p>
          <h4>TAGS:</h4>
          <p>{recipe.tags}</p>
          <h4>SAVED:</h4>
          <p>{checkDate(recipe.saved)}</p>
          <h4>EDITED:</h4>
          <p>{checkDate(recipe.edited)}</p>
          <h4>MADE:</h4>
          <p>{checkDate(recipe.made)}</p>
        </div>
      </div>
    </div>
  );
}
