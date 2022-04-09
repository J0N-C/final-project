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
  return (
    <>
      <div id="sub-header-bot">

      </div>
    </>
  );
}
