import React from 'react';
import MainHeader from '../components/main-header';
import SubHeader from '../components/sub-header';
import Navbar from '../components/navbar';
import CompactCards from '../components/view-compact-recipe';
import FullCard from '../components/view-full-recipe';

export default function ViewRecipes(props) {
  return (
    <>
      <MainHeader />
      <SubHeader />
      <CardViews recipeId={props.recipeId} />
      <Navbar />
    </>
  );
}

class CardViews extends React.Component {
  constructor(props) {
    super(props);
    this.state = { recipes: [] };
    this.updateMade = this.updateMade.bind(this);
  }

  componentDidMount() {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(result => {
        this.setState({ recipes: result });
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
    return <FullCard recipe={this.findRecipe(this.props.recipeId)} updateMade={this.updateMade} />;
  }
}
