import React from 'react';
import AddRecipeForm from '../components/add-recipe-form';
import MainHeader from '../components/main-header';
import SubHeader from '../components/sub-header';
import Navbar from '../components/navbar';

function newRecipe(newRecipe) {
  const addedRecipe = JSON.stringify(newRecipe);
  const postHeader = [
    ['Content-Type', 'application/json']
  ];
  fetch('/api/addrecipe', { method: 'POST', headers: postHeader, body: addedRecipe })
    .then(res => res.json());
}

export default function AddRecipe(props) {

  return (
    <>
      <MainHeader />
      <SubHeader />
      <AddRecipeForm onSubmit={newRecipe} />
      <Navbar />
    </>
  );
}
