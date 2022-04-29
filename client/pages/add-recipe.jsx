import React from 'react';
import Redirect from '../components/redirect';
import AddRecipeForm from '../components/add-recipe-form';
import SubHeader from '../components/sub-header';

function newRecipe(newRecipe) {
  const token = window.localStorage.getItem('react-context-jwt');
  const postHeader = [
    ['Content-Type', 'application/json'],
    ['X-Access-Token', token]
  ];
  const addedRecipe = JSON.stringify(newRecipe);
  fetch('/api/addrecipe', { method: 'POST', headers: postHeader, body: addedRecipe })
    .then(res => res.json());
}

export default function AddRecipe(props) {
  if (!props.user) return <Redirect to="sign-in" />;
  return (
    <>
      <SubHeader />
      <AddRecipeForm onSubmit={newRecipe} />
    </>
  );
}
