import React from 'react';

export default function DisplayIngredientsList(props) {
  const ingredientsList = props.ingredients;
  if (ingredientsList.length > 0) {
    return (
      <ul>
        {
          ingredientsList.map((ingredient, i) => {
            return (
              <li key={i}>{`${ingredient.amount} ${ingredient.name} ${ingredient.prep}`}</li>
            );
          })
        }
      </ul>
    );
  } else return <></>;

}
