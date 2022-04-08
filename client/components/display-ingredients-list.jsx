import React from 'react';

export default function DisplayIngredientsList(props) {
  const ingredientsList = props.ingredients;
  if (ingredientsList.length > 0) {
    return (
      <ul>
        {
          ingredientsList.map((ingredient, i) => {
            return (
              <li className="flex just-btwn ingredient-preview" key={i} data-ri={i}>
                <p>{`${ingredient.amount} ${ingredient.name} ${ingredient.prep}`}</p>
                <a onClick={props.delete}><i className="fa-solid fa-circle-xmark gray-icon"></i></a>
              </li>
            );
          })
        }
      </ul>
    );
  } else return <></>;

}
