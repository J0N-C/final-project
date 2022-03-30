import React from 'react';

export default class AddIngredientForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: '',
      name: '',
      prep: '',
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { name } = this.state;
    const ingredientName = name.toLowerCase().trim();
    if (ingredientName) {
      const newIngredient = this.state;
      delete newIngredient.error;
      this.props.onIngredientSubmit(newIngredient);
      this.setState({
        quantity: '',
        name: '',
        prep: '',
        error: null
      });
    } else {
      this.setState({ error: 'Ingredient is required!' });
    }
  }

  emptyIngredient() {
    if (this.state.error) {
      return <p className="red">{this.state.error}</p>;
    }
  }

  render() {
    return (
      <div className="ingredient-entry-form flex al-center wrap">
        <label htmlFor="ingredient" className="col-full">Add New Ingredient</label>
        <div className="ingredient-inputs">
          <input name="quantity" id="quantity" onChange={this.handleChange} type="text" value={this.state.quantity} placeholder="Quantity ex: 2 cups" />
          <input name="name" id="ingredient-name" onChange={this.handleChange} type="text" value={this.state.name} placeholder="Enter ingredient name" />
          {this.emptyIngredient()}
          <input name="prep" id="prep" onChange={this.handleChange} type="text" value={this.state.prep} placeholder="Preparation, ex: diced" />
        </div>
        <div>
          <button className="submit-new-ingredient" onClick={this.handleSubmit}>Add</button>
        </div>
      </div>
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
