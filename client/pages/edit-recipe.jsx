import React from 'react';
import AddRecipeForm from '../components/add-recipe-form';
import MainHeader from '../components/main-header';
import SubHeader from '../components/sub-header';
import Navbar from '../components/navbar';

function editRecipe(editedRecipe) {
  const updateRecipe = JSON.stringify(editedRecipe);
  const postHeader = [
    ['Content-Type', 'application/json']
  ];
  fetch('/api/editrecipe', { method: 'POST', headers: postHeader, body: updateRecipe })
    .then(res => res.json());
}

export default function AddRecipe(props) {

  return (
    <>
      <MainHeader />
      <SubHeader />
      <AddRecipeForm onSubmit={editRecipe} />
      <Navbar />
    </>
  );
}
