import React from 'react';
import MainHeader from '../components/main-header';
import SubHeader from '../components/sub-header';
import Navbar from '../components/navbar';
import CompactCards from '../components/view-compact-recipe';
import SearchRecipesForm from '../components/search-recipes-form';
import { parseRoute } from '../lib';

export default function SearchRecipes(props) {
  return (
    <>
      <MainHeader location={parseRoute(location.hash)} />
      <SearchPage />
      <Navbar />
    </>
  );
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { recipes: [], searchResults: [] };
    this.searchResultDisplay = this.searchResultDisplay.bind(this);
  }

  componentDidMount() {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(result => {
        const recipes = result.map(recipe => {
          const ingredientNames = recipe.ingredients.map(ingredient => {
            return ingredient.name;
          });
          recipe.ingredientNames = ingredientNames.join(' ');
          if (recipe.tags[0]) {
            recipe.tagNames = recipe.tags.join(' ');
          }
          return recipe;
        });
        this.setState({ recipes });
      });
  }

  searchResultDisplay(searchTerms) {
    let results = [];
    if (searchTerms.name) {
      const nameRegex = new RegExp(`${searchTerms.name}`, 'i');
      const nameResult = this.state.recipes.map(recipe => {
        const test = nameRegex.test(recipe.name);
        return test ? recipe.recipeId : null;
      });
      results = results.concat(nameResult);
    }
    if (searchTerms.ingredients) {
      const ingRegex = new RegExp(`${searchTerms.ingredients}`, 'i');
      const ingResult = this.state.recipes.map(recipe => {
        const test = ingRegex.test(recipe.ingredientNames);
        return test ? recipe.recipeId : null;
      });
      results = results.concat(ingResult);
    }
    if (searchTerms.tags) {
      const tagRegex = new RegExp(`${searchTerms.tags}`, 'i');
      const tagResult = this.state.recipes.map(recipe => {
        const test = tagRegex.test(recipe.tagNames);
        return test ? recipe.recipeId : null;
      });
      results = results.concat(tagResult);
    }
    const setResults = [...new Set(results)].filter(Boolean);
    const finalResults = setResults.map(id => {
      return this.state.recipes.find(recipe => recipe.recipeId === id);
    });
    this.setState({ searchResults: finalResults });
  }

  render() {
    if (this.state.searchResults[0]) {
      return (
        <>
          <SubHeader />
          <div id="result-list">
            {
              this.state.searchResults.map(recipe => {
                return (
                  <CompactCards recipe={recipe} key={recipe.recipeId} />
                );
              })
            }
          </div>
        </>
      );
    }
    return (
      <>
        <SubHeader />
        <SearchRecipesForm result={this.searchResultDisplay} />
      </>
    );
  }
}
