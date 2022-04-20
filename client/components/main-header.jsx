import React from 'react';
import NavBarTop from './navbar-top';

export default function MainHeader(props) {
  let showLogout = '';
  if (!props.user) {
    showLogout = 'hidden';
  }
  let title = 'WHAT\'S COOKING TODAY?';
  if (props.location) {
    const loc = props.location.path;
    switch (loc) {
      case 'add-recipe':
        title = 'ADDING NEW RECIPE CARD';
        break;
      case 'view-recipes':
        title = 'VIEWING RECIPE CARDS';
        break;
      case 'view-recipe':
        title = 'VIEWING CARD';
        break;
      case 'edit-recipe':
        title = 'EDITING RECIPE CARD';
        break;
      case 'search-recipes':
        title = 'SEARCHING RECIPES';
        break;
    }
  }
  return (
    <div className="sticky-top">
      <div id="main-header" className="flex just-btwn al-center">
        <a href="">
          <h1>Recipe Deck</h1>
        </a>
        <a className={`flex al-center ${showLogout}`} onClick={props.handleSignOut}>
          <p className="sign-out">SIGN OUT</p>
          <i className="fa-solid fa-arrow-right-from-bracket sign-out"></i>
        </a>
      </div>
      <div className="flex">
        <div id="sub-header-top" className="col-50">
          <h3>{title}</h3>
        </div>
        <NavBarTop />
      </div>
    </div>

  );
}
