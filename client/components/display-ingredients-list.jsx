import React from 'react';

export default function DisplayIngredientsList(props) {
  const ingredientsList = props.ingredients;
  return (
    <ul>
      {
        ingredientsList.map((ingredient, i) => {
          return (
            <li key={i}>{`${ingredient.quantity} ${ingredient.name} ${ingredient.prep}`}</li>
          );
        })
      }
    </ul>
  );
}
