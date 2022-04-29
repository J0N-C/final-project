import React from 'react';
import SubHeader from '../components/sub-header';
import CompactCards from '../components/view-compact-recipe';
import SearchRecipesForm from '../components/search-recipes-form';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default function SearchRecipes(props) {
  return (
      <SearchPage />
  );
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: true,
      recipes: [],
      searchResults: [],
      searchTerms: {
        name: '',
        ingredients: '',
        tags: '',
        error: null
      },
      token: window.localStorage.getItem('react-context-jwt')
    };
    this.searchResultDisplay = this.searchResultDisplay.bind(this);
    this.newSearch = this.newSearch.bind(this);
    this.openSearch = this.openSearch.bind(this);
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

  openSearch() {
    const formState = !this.state.searchForm;
    this.setState({ searchForm: formState });
  }

  newSearch() {
    this.openSearch();
    this.setState({
      searchTerms: {
        name: '',
        ingredients: '',
        tags: '',
        error: null
      }
    });
  }

  searchResultDisplay(searchTerms) {
    this.openSearch();
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
      searchTerms.ingredients.forEach(ingredient => {
        const ingRegex = new RegExp(`${ingredient}`, 'i');
        const ingResult = this.state.recipes.map(recipe => {
          const test = ingRegex.test(recipe.ingredientNames);
          return test ? recipe.recipeId : null;
        });
        results = results.concat(ingResult);
      });
    }
    if (searchTerms.tags) {
      searchTerms.tags.forEach(tag => {
        const tagRegex = new RegExp(`${tag}`, 'i');
        const tagResult = this.state.recipes.map(recipe => {
          const test = tagRegex.test(recipe.tagNames);
          return test ? recipe.recipeId : null;
        });
        results = results.concat(tagResult);
      });
    }
    const setResults = [...new Set(results)].filter(Boolean);
    const finalResults = setResults.map(id => {
      return this.state.recipes.find(recipe => recipe.recipeId === id);
    });
    this.setState({ searchResults: finalResults, searchTerms });
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    if (!this.state.searchForm) {
      return (
        <>
          <SubHeader searchTerms={this.state.searchTerms} resultCount={this.state.searchResults.length} openSearch={this.openSearch} newSearch={this.newSearch}/>
          <div id="result-list" className="flex wrap">
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
        <SearchRecipesForm searchTerms={this.state.searchTerms} result={this.searchResultDisplay} />
      </>
    );
  }
}

SearchPage.contextType = AppContext;
