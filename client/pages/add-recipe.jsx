import React from 'react';
import AddRecipeForm from '../components/add-recipe-form';

function newRecipe(newRecipe) {
  const addedRecipe = JSON.stringify(newRecipe);
  const postHeader = [
    ['Content-Type', 'application/json']
  ];
  fetch('/api/addrecipe', { method: 'POST', headers: postHeader, body: addedRecipe })
    .then(res => res.json());
}

export default function Home(props) {

  return (
    <AddRecipeForm onSubmit={newRecipe}/>
  );
}
