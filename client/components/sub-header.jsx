import React from 'react';
import { parseRoute } from '../lib';

export default function SubHeader(props) {
  if (parseRoute(location.hash).path === 'view-recipes') {
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
    if (props.searchTerms.ingredients) {
      ingredients = props.searchTerms.ingredients.join(', ');
    }
    if (props.searchTerms.tags) {
      tags = props.searchTerms.tags.join(', ');
    }
    return (
      <>
        <div id="sub-header-bot">
          <h4>{props.resultCount} RESULTS FOUND</h4>
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
