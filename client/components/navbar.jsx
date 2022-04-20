import React from 'react';

export default function navBar(props) {
  if (props.path === 'sign-in' || props.path === 'sign-up') {
    return (
      <>
        <div id="navbar" className="flex just-even">

        </div>
      </>
    );
  }
  return (
    <>
      <div id="navbar" className="flex just-even">
        <a href='#add-recipe'>
          <i className="fa-solid fa-file-circle-plus"></i>
        </a>
        <a href='#view-recipes'>
          <i className="fa-solid fa-book-open"></i>
        </a>
        <a href='#search-recipes'>
          <i className="fa-solid fa-magnifying-glass"></i>
        </a>
      </div>
    </>
  );
}
