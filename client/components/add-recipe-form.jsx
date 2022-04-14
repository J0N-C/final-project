import React from 'react';
import AddIngredientForm from './add-ingredient-form';
import DisplayIngredientsList from './display-ingredients-list';

export default class AddRecipeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      ingredients: [],
      instructions: '',
      notes: '',
      tags: '',
      tagCount: 0,
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.onIngredientSubmit = this.onIngredientSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    if (this.props.editing) {
      const editR = this.props.editing;
      this.setState({
        recipeId: editR.recipeId,
        name: editR.name,
        image: editR.images[0],
        ingredients: editR.ingredients,
        deleteIngredient: [],
        instructions: editR.instructions,
        notes: editR.notes,
        tags: editR.tags.join(', '),
        tagCount: editR.tags.length,
        error: null
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name !== 'ingredients') {
      this.setState({ [name]: value });
    }
  }

  onIngredientSubmit(newIngredient) {
    if (this.state.ingredients.find(ingredient => ingredient.name === newIngredient.name)) {
      return this.setState({ error: 'Duplicate ingredients not allowed!' });
    }
    const newIngredientList = this.state.ingredients.concat(newIngredient);
    this.setState({ ingredients: newIngredientList });
  }

  emptyIngredient() {
    if (this.state.error) {
      return <p className="red">{this.state.error}</p>;
    }
  }

  deleteIngredient(e) {
    const i = parseInt(e.currentTarget.parentElement.getAttribute('data-ri'));
    const newIList = [...this.state.ingredients];
    newIList.splice(i, 1);
    this.setState({ ingredients: newIList });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.ingredients.length === 0) {
      return (
        this.setState({ error: 'Please enter at least 1 ingredient!' })
      );
    }
    const newRecipe = {
      recipe: this.state
    };
    delete newRecipe.error;
    if (this.state.tags[0]) {
      const splitTags = [...new Set(newRecipe.recipe.tags.toLowerCase().split(',').map(tag => tag.trim()).filter(Boolean))];
      newRecipe.recipe.tags = splitTags;
      newRecipe.recipe.tagCount = splitTags.length;
    }
    this.props.onSubmit(newRecipe);
    window.location.hash = 'view-recipes';
    this.setState({
      name: '',
      image: '',
      ingredients: '',
      instructions: '',
      notes: '',
      tags: '',
      tagCount: 0,
      error: null
    });
  }

  cancel() {
    history.back();
  }

  render() {
    let buttonName;
    if (this.state.recipeId) {
      buttonName = 'Finish Editing';
    } else buttonName = 'Add Recipe';
    return (
      <div id="add-form-container">
        <form id="add-recipe-form" className="flex-col box-shadow" onSubmit={this.handleSubmit}>
          <label htmlFor="name">Recipe Name</label>
          <input required name="name" id="recipe-name" onChange={this.handleChange} type="text" value={this.state.name} placeholder="Enter recipe name" />
          <label htmlFor="image">Image URL</label>
          <input name="image" id="image" onChange={this.handleChange} type="url" value={this.state.image} placeholder="Optional Recipe Image" />
          <label htmlFor="ingredients">Ingredients</label>
          <DisplayIngredientsList ingredients={this.state.ingredients} delete={this.deleteIngredient} />
          {this.emptyIngredient()}
          <AddIngredientForm onIngredientSubmit={this.onIngredientSubmit} />
          <label htmlFor="instructions">Instructions</label>
          <textarea required name="instructions" id="instructions" onChange={this.handleChange} value={this.state.instructions} placeholder="Enter recipe instructions List" rows="5"/>
          <label htmlFor="notes">Notes</label>
          <textarea name="notes" id="notes" onChange={this.handleChange} value={this.state.notes} placeholder="Enter optional notes here" rows="3"/>
          <label htmlFor="tags">Tags</label>
          <textarea name="tags" id="tags" onChange={this.handleChange} value={this.state.tags} placeholder="Enter optional tags separated by commas, ex: lunch, beef, dairy, gluten" rows="3"/>
          {this.emptyIngredient()}
          <button type="submit">{buttonName}</button>
          <button type="button" onClick={this.cancel}>Cancel</button>
        </form>
      </div>
    );
  }
}
