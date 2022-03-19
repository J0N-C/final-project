import React from 'react';
import MainHeader from '../components/main-header';
import SubHeader from '../components/sub-header';
import ViewingRecipes from '../components/viewing-recipes';
import Navbar from '../components/navbar';

export default function ViewRecipes(props) {
  return (
    <>
      <MainHeader />
      <SubHeader />
      <ViewingRecipes />
      <Navbar />
    </>
  );
}
