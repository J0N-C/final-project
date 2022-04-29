import React from 'react';
import SubHeader from '../components/sub-header';
import AppContext from '../lib/app-context';
import CompactCards from '../components/view-compact-recipe';
import FullCard from '../components/view-full-recipe';
import AddRecipeForm from '../components/add-recipe-form';

export default function ViewRecipes(props) {
  return (
      <CardViews recipeId={props.recipeId} editing={props.editing}/>
  );
}

class CardViews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      sort: 'new',
      token: window.localStorage.getItem('react-context-jwt')
    };
    this.updateMade = this.updateMade.bind(this);
    this.editRecipe = this.editRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.sortRecipe = this.sortRecipe.bind(this);
  }

  componentDidMount() {
    if (!this.state.token) return;
    const postHeader = [
      ['Content-Type', 'application/json'],
      ['X-Access-Token', this.state.token]
    ];
    fetch('/api/recipes', { method: 'GET', headers: postHeader })
      .then(res => res.json())
      .then(result => {
        const recipes = result.map(recipe => {
          const dateNum = (new Date(recipe.saved)).getTime();
          recipe.dateNum = dateNum;
          const madeNum = (new Date(recipe.lastMade)).getTime();
          recipe.madeNum = madeNum;
          return recipe;
        });
        recipes.sort((a, b) => {
          return b.dateNum - a.dateNum;
        });
        this.setState({ recipes });
      });
  }

  sortRecipe(e) {
    const sortMethod = e.target.value;
    const sortedArray = [...this.state.recipes];
    if (sortMethod === 'new') {
      sortedArray.sort((a, b) => {
        return b.dateNum - a.dateNum;
      });
    }
    if (sortMethod === 'old') {
      sortedArray.sort((a, b) => {
        return a.dateNum - b.dateNum;
      });
    }
    if (sortMethod === 'a-z') {
      sortedArray.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        return nameA < nameB
          ? -1
          : nameA > nameB
            ? 1
            : 0;
      });
    }
    if (sortMethod === 'made-new') {
      sortedArray.sort((a, b) => {
        return b.madeNum - a.madeNum;
      });
    }
    if (sortMethod === 'made-old') {
      sortedArray.sort((a, b) => {
        return a.madeNum - b.madeNum;
      });
    }
    this.setState({ recipes: sortedArray });
  }

  editRecipe(editedRecipe) {
    const updateRecipe = JSON.stringify(editedRecipe);
    const postHeader = [
      ['Content-Type', 'application/json'],
      ['X-Access-Token', this.state.token]
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
      ['Content-Type', 'application/json'],
      ['X-Access-Token', this.state.token]
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
      ['Content-Type', 'application/json'],
      ['X-Access-Token', this.state.token]
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
      if (!this.state.recipes[0]) {
        const message = 'You have no recipes saved! Try adding a new recipe!';
        return <SubHeader message={message} />;
      }
      return (
        <>
          <SubHeader sortMethod={this.sortRecipe} />
          <div id="recipes-list" className="flex wrap">
            {
              this.state.recipes.map(recipe => {
                return (
                  <CompactCards recipe={recipe} key={recipe.recipeId} />
                );
              })
            }
          </div>
        </>
      );
    }
    if (this.props.editing) {
      return (
        <>
          <SubHeader />
          <AddRecipeForm editing={this.findRecipe(this.props.recipeId)} onSubmit={this.editRecipe} />
        </>
      );
    }
    return (
      <>
        <SubHeader />
        <FullCard recipe={this.findRecipe(this.props.recipeId)} updateMade={this.updateMade} delete={this.deleteRecipe} />
      </>
    );
  }
}

CardViews.contextType = AppContext;
