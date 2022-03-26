import React from 'react';
import checkDate from './checkdate';

function splitLines(array) {
  return (
    array.map((item, i) => {
      return <li key={i}>{item}</li>;
    })
  );
}

const back = () => {
  history.back();
};

function TaglistFromArray(array) {
  return (
    // eslint-disable-next-line array-callback-return
    array.map((item, i, x) => {
      if (item) {
        return <a className='tags' key={i}>{item}</a>;
      }
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
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });

  return (
    <div id={recipe.recipeId} className="recipe-card-full box-shadow">
      <div className="card-title flex just-btwn">
        <h2>{recipe.name}</h2>
        <a onClick={back}>
          <i id="back-arrow" className="fa-solid fa-caret-left"></i>
        </a>
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
          <p>{TaglistFromArray(recipe.tags)}</p>
          <h4>SAVED:</h4>
          <p>{checkDate(recipe.saved)}</p>
          <h4>EDITED:</h4>
          <p>{checkDate(recipe.edited)}</p>
          <h4>LAST MADE:</h4>
          <p>{checkDate(recipe.made)}</p>
          <button>MADE THIS TODAY!</button>
        </div>
      </div>
    </div>
  );
}
