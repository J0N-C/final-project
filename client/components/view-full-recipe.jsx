import React from 'react';
import checkDate from './checkdate';

function splitLines(array) {
  return (
    array.map((item, i) => {
      if (item) {
        return <li key={i}>{item}</li>;
      } else return null;
    })
  );
}

const back = () => {
  history.back();
};

function TaglistFromArray(array) {
  return (
    array.map((item, i) => {
      if (item) {
        return <a className='tags' key={i}>{item}</a>;
      } else return null;
    })
  );
}

function ingredientsListFromArray(array) {
  return (
    array.map((item, i) => {
      if (item) {
        return <li className='ingredient-item' key={i}>{`${item.amount} ${item.name} ${item.prep}`}</li>;
      } else return null;
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
  const instructions = (recipe.instructions.split('\n'));
  const notes = (recipe.notes.split('\n'));
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
        <div className="flex">
          <div className="image-full">
            <img src={recipe.images[0]} />
          </div>
          <a href={`#edit-recipe?recipeId=${recipe.recipeId}`} className="pos-rel">
            <i id="edit-recipe" className="fa-solid fa-pen"></i>
          </a>
        </div>
        <div className="full-card-content">
          <h4>INGREDIENTS:</h4>
          <ul>
            {ingredientsListFromArray(recipe.ingredients)}
          </ul>
          <h4>INSTRUCTIONS:</h4>
          <ul>
            {splitLines(instructions)}
          </ul>
          <h4>NOTES:</h4>
          <ul>
            {splitLines(notes)}
          </ul>
          <h4>TAGS:</h4>
          <p className="flex wrap">{TaglistFromArray(recipe.tags)}</p>
          <h4>SAVED:</h4>
          <p>{checkDate(recipe.saved)}</p>
          <h4>EDITED:</h4>
          <p>{checkDate(recipe.lastEdited)}</p>
          <h4>LAST MADE:</h4>
          <p>{checkDate(recipe.lastMade)}</p>
          <button onClick={(() => props.updateMade(recipe.recipeId))}>MADE THIS TODAY!</button>
        </div>
      </div>
    </div>
  );
}
