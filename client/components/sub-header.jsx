import React from 'react';
import { parseRoute } from '../lib';

export default function SubHeader(props) {
  if (parseRoute(location.hash).path === 'sign-in' || parseRoute(location.hash).path === 'sign-up') {
    return (
      <>
        <div id="sub-header-bot">
          <h4>{props.welcomeMessage}</h4>
        </div>
      </>
    );
  }
  if (parseRoute(location.hash).path === 'view-recipes') {
    if (props.message) {
      return (
        <div id="sub-header-bot">
          <p>{props.message}</p>
        </div>
      );
    }
    return (
      <>
        <div id="sub-header-bot">
          <label htmlFor="sort-view"></label>
          <select name="sort-view" id="sort-view" defaultValue='new' onChange={props.sortMethod}>
            <option value="new">DATE SAVED (NEWEST)</option>
            <option value="old" >DATE SAVED (OLDEST)</option>
            <option value="made-new" >LAST MADE (NEWEST)</option>
            <option value="made-old" >LAST MADE (OLDEST)</option>
            <option value="a-z" >NAME (A-Z)</option>
          </select>
        </div>
      </>
    );
  }
  if (parseRoute(location.hash).path === 'search-recipes' && props.searchTerms) {
    let tags;
    let ingredients;
    let results;
    if (props.searchTerms.ingredients) {
      ingredients = props.searchTerms.ingredients.join(', ');
    }
    if (props.searchTerms.tags) {
      tags = props.searchTerms.tags.join(', ');
    }
    if (props.resultCount === 1) {
      results = '1 RESULT FOUND';
    } else results = `${props.resultCount} RESULTS FOUND`;
    return (
      <>
        <div id="sub-header-bot">
          <h4>{results}</h4>
          <p><span>NAME:</span> {props.searchTerms.name}</p>
          <p><span>INGREDIENTS:</span> {ingredients}</p>
          <p><span>TAGS:</span> {tags}</p>
          <div className="flex just-btwn">
            <button onClick={props.openSearch}>EDIT SEARCH</button>
            <button onClick={props.newSearch}>NEW SEARCH</button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div id="sub-header-bot">

      </div>
    </>
  );
}
