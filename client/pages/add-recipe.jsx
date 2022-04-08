import React from 'react';
import AddRecipeForm from '../components/add-recipe-form';
import MainHeader from '../components/main-header';
import SubHeader from '../components/sub-header';
import Navbar from '../components/navbar';
import { parseRoute } from '../lib';

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
      <SubHeader location={parseRoute(location.hash)} />
      <AddRecipeForm onSubmit={newRecipe} />
      <Navbar />
    </>
  );
}
