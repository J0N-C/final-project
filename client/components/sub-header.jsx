import React from 'react';

export default function SubHeader(props) {
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
    }
  }
  return (
    <>
      <div id="sub-header-top">
        <h3>{title}</h3>
      </div>
      <div id="sub-header-bot">

      </div>
    </>
  );
}
