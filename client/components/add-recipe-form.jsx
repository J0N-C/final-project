import React from 'react';
// import AddIngredientForm from './add-ingredient-form'; !For future use!

export default class AddRecipeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      ingredients: '',
      instructions: '',
      notes: '',
      tags: ''
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
    const newRecipe = {
      recipe: this.state
    };
    this.props.onSubmit(newRecipe);
    this.setState({
      name: '',
      image: '',
      ingredients: '',
      instructions: '',
      notes: '',
      tags: ''
    });
  }

  render() {
    return (
      <div id="add-form-container">
        <form id="add-recipe-form" className="flex-col box-shadow" onSubmit={this.handleSubmit}>
          <label htmlFor="name">Recipe Name</label>
          <input required name="name" id="recipe-name" onChange={this.handleChange} type="text" value={this.state.name} placeholder="Enter recipe name" />
          <label htmlFor="image">Image URL</label>
          <input name="image" id="image" onChange={this.handleChange} type="url" value={this.state.image} placeholder="Optional Recipe Image" />
          {/* Replace in future with separate ingredients list component */}
          <label htmlFor="ingredients">Ingredients</label>
          <textarea required name="ingredients" id="ingredients" onChange={this.handleChange} value={this.state.ingredients} placeholder="Enter recipe ingredients List" rows="5"/>
          <label htmlFor="instructions">Instructions</label>
          <textarea required name="instructions" id="instructions" onChange={this.handleChange} value={this.state.instructions} placeholder="Enter recipe instructions List" rows="5"/>
          <label htmlFor="notes">Notes</label>
          <textarea name="notes" id="notes" onChange={this.handleChange} value={this.state.notes} placeholder="Enter optional notes here" rows="3"/>
          <label htmlFor="tags">Tags</label>
          <textarea name="tags" id="tags" onChange={this.handleChange} value={this.state.tags} placeholder="Enter optional tags separated by commas, ex: lunch, beef, dairy, gluten" rows="3"/>
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    );
  }
}
