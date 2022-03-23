import React from 'react';
import checkDate from './checkdate';

export default function CompactCards(props) {
  const recipe = props.recipe;
  if (!recipe) {
    return (
      <>
      <p>loading...</p>
      </>
    );
  }

  return (
    <a id={recipe.recipeId} href={`#view-recipe?recipeId=${recipe.recipeId}`} className="recipe-card-compact box-shadow">
        <div className="card-title">
          <h2>{recipe.name}</h2>
        </div>
        <div className="preview-container flex">
          <div className="image-preview">

          </div>
          <div className="card-preview">
            <h4>TAGS:</h4>
            <p>{recipe.tags}</p>
            <h4>SAVED:</h4>
            <p>{checkDate(recipe.saved)}</p>
            <h4>MADE:</h4>
            <p>{checkDate(recipe.made)}</p>
          </div>
        </div>
      </a>
  );
}
