import React from 'react';

export default function navBarTop(props) {
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
      <div id="navbar-top" className="flex just-end col-50">
        <div className="flex just-end">
          <a href='#add-recipe' className="col-25">
            <i className="fa-solid fa-file-circle-plus"></i>
            <span>Add</span>
          </a>
          <a href='#view-recipes' className="col-25">
            <i className="fa-solid fa-book-open"></i>
            <span>View</span>
          </a>
          <a href='#search-recipes' className="col-33">
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Search</span>
          </a>
        </div>
      </div>
    </>
  );
}
