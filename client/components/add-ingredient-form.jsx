import React from 'react';

export default class AddIngredientForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: null,
      name: '',
      prep: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      quantity: null,
      name: '',
      prep: ''
    });
  }

  render() {
    return (
      <li className="ingredient-list-item">
        <label htmlFor="ingredient">Ingredients List</label>
        <input name="quantity" id="quantity" type="text" placeholder="Quantity ex: 2 cups" />
        <input required name="ingredient" id="ingredient" type="text" placeholder="Enter ingredient name" />
        <input name="prep" id="prep" type="text" placeholder="Preparation, ex: diced" />
      </li>
    );
  }
}

/*
<label htmlFor="ingredient">Ingredients List</label>
<input name="quantity" id="quantity" type="text" placeholder="Quantity ex: 2 cups" />
<input required name="ingredient" id="ingredient" type="text" placeholder="Enter ingredient name" />
<input name="prep" id="prep" type="text" placeholder="Preparation, ex: diced" />
<button id="add-ingredient-button">Add Another Ingredient</button>
*/
