import React from 'react';

export default class ViewingRecipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
  }

  componentDidMount() {
    const user = 1; // USING DUMMY USER 1 REPLACE AT END
    fetch(`/api/${user}`)
      .then(res => res.json())
      .then(recipes => this.setState([recipes]));
    // .then(console.log(this.state));
  }

  render() {
    return (
      <div id="viewing-recipes">

      </div>
    );
  }
}
