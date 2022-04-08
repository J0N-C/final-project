import React from 'react';
import MainHeader from '../components/main-header';
import SubHeader from '../components/sub-header';
import Navbar from '../components/navbar';
import CompactCards from '../components/view-compact-recipe';
import FullCard from '../components/view-full-recipe';
import AddRecipeForm from '../components/add-recipe-form';

export default function ViewRecipes(props) {
  return (
    <>
      <MainHeader />
      <SubHeader />
      <CardViews recipeId={props.recipeId} editing={props.editing}/>
      <Navbar />
    </>
  );
}
class CardViews extends React.Component {
  constructor(props) {
    super(props);
    this.state = { recipes: [] };
    this.updateMade = this.updateMade.bind(this);
    this.editRecipe = this.editRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  componentDidMount() {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(result => {
        this.setState({ recipes: result });
      });
  }

  editRecipe(editedRecipe) {
    const updateRecipe = JSON.stringify(editedRecipe);
    const postHeader = [
      ['Content-Type', 'application/json']
    ];
    fetch('/api/editrecipe', { method: 'PUT', headers: postHeader, body: updateRecipe })
      .then(res => res.json())
      .then(result => {
        const updatedRecipe = result;
        const recipesList = [...this.state.recipes];
        const index = recipesList.findIndex(recipe => {
          return (recipe.recipeId === updatedRecipe.recipeId);
        });
        recipesList[index] = updatedRecipe;
        this.setState({ recipes: recipesList });
      });
  }

  updateMade(recipeId) {
    const postHeader = [
      ['Content-Type', 'application/json']
    ];
    fetch(`/api/made-this/${recipeId}`, { method: 'PUT', headers: postHeader })
      .then(res => res.json())
      .then(result => {
        const [updatedRecipe] = result;
        const recipesList = [...this.state.recipes];
        const index = recipesList.findIndex(recipe => {
          return (recipe.recipeId === updatedRecipe.recipeId);
        });
        recipesList[index].lastMade = updatedRecipe.lastMade;
        this.setState({ recipes: recipesList });
      });
  }

  deleteRecipe(recipeId) {
    const postHeader = [
      ['Content-Type', 'application/json']
    ];
    fetch(`/api/delete-recipe/${recipeId}`, { method: 'DELETE', headers: postHeader })
      .then(res => res.json())
      .then(result => {
        const recipesList = [...this.state.recipes];
        const index = recipesList.findIndex(recipe => {
          return (recipe.recipeId === result.deleted);
        });
        recipesList.splice(index, 1);
        this.setState({ recipes: recipesList });
        window.location.hash = 'view-recipes';
      });
  }

  findRecipe(id) {
    return this.state.recipes.find(recipe => (recipe.recipeId === id));
  }

  render() {
    if (!this.props.recipeId) {
      return (
        <div id="recipes-list">
          {
            this.state.recipes.map(recipe => {
              return (
                <CompactCards recipe={recipe} key={recipe.recipeId} />
              );
            })
          }
        </div>
      );
    }
    if (this.props.editing) {
      return <AddRecipeForm editing={this.findRecipe(this.props.recipeId)} onSubmit={this.editRecipe} />;
    }
    return <FullCard recipe={this.findRecipe(this.props.recipeId)} updateMade={this.updateMade} delete={this.deleteRecipe}/>;
  }
}
