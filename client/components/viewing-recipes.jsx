import React from 'react';
import CompactCards from './view-compact-recipe';

export default class ViewingRecipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = { recipes: [] };
  }

  componentDidMount() {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(result => {
        this.setState({ recipes: result });
      });
  }

  render() {
    return (
      <div id="recipes-list">
        <CompactCards recipes={this.state.recipes} />
      </div>
    );
  }
}
