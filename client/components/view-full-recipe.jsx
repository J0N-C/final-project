import React, { useState } from 'react';
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

function DeleteConfirmation(props) {
  if (props.deletePopup) {
    return (
      <div className="dark-overlay flex-col just-cent al-center">
        <div className="delete-popup flex-col col-30">
          <p className="text-center">ARE YOU SURE YOU WANT TO DELETE RECIPE FOR: <span className="bold">{props.recipeName.toUpperCase()}</span>?</p>
          <button onClick={props.delete} className="confirm-delete">CONFIRM</button>
          <button onClick={props.cancel} className="close-delete">CANCEL</button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
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
  const [deletePopup, setDeletePopup] = useState(false);
  return (
    <>
      <DeleteConfirmation recipeName={recipe.name} deletePopup={deletePopup} delete={() => { props.delete(recipe.recipeId); }} cancel={() => { setDeletePopup(false); }}/>
      <div id={recipe.recipeId} className="recipe-card-full box-shadow">
        <div className="card-title flex just-btwn">
          <h2>{recipe.name}</h2>
          <a onClick={back}>
            <i id="back-arrow" className="fa-solid fa-caret-left"></i>
          </a>
        </div>
        <div className="full-card-content flex wrap">
          <div className="col-full">
            <div className="flex">
              <div className="image-full flex just-cent">
                <img src={recipe.images[0]} />
              </div>
              <a href={`#edit-recipe?recipeId=${recipe.recipeId}`}>
                <i id="edit-recipe" className="fa-solid fa-pen"></i>
              </a>
            </div>
          </div>
          <div className="col-full">
            <div className="full-card-content flex wrap">
              <div className="col-33">
                <h4>INGREDIENTS:</h4>
                <ul>
                  {ingredientsListFromArray(recipe.ingredients)}
                </ul>
              </div>
              <div className="col-66">
                <h4>INSTRUCTIONS:</h4>
                <ul>
                  {splitLines(instructions)}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-full flex wrap">
            <div className="col-full">
              <h4>NOTES:</h4>
              <ul>
                {splitLines(notes)}
              </ul>
            </div>

            <div className="col-25">
              <h4>TAGS:</h4>
              <p className="flex wrap">{TaglistFromArray(recipe.tags)}</p>
            </div>
            <div className="col-25">
              <h4>SAVED:</h4>
              <p>{checkDate(recipe.saved)}</p>
            </div>
            <div className="col-25">
              <h4>EDITED:</h4>
              <p>{checkDate(recipe.lastEdited)}</p>
            </div>
            <div className="col-25">
              <h4>LAST MADE:</h4>
              <p>{checkDate(recipe.lastMade)}</p>
            </div>
            <div className="col-full flex al-end just-btwn">
              <button onClick={(() => props.updateMade(recipe.recipeId))}>MADE THIS TODAY!</button>
              <a onClick={() => { setDeletePopup(true); }}>
                <i id="delete-recipe" className="fa-solid fa-trash-can"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
