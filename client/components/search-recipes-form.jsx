import React from 'react';

export default class SearchRecipesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      ingredients: '',
      tags: '',
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
    if (!this.state.name && !this.state.ingredients && !this.state.tags) {
      return (
        this.setState({ error: 'Please enter at least 1 search term!' })
      );
    }
    const searchTerms = this.state;
    delete searchTerms.error;
    if (this.state.ingredients[0]) {
      const splitIngs = [...new Set(searchTerms.ingredients.toLowerCase().split(',').map(ing => ing.trim()).filter(Boolean))];
      searchTerms.ingredients = splitIngs;
    }
    if (this.state.tags[0]) {
      const splitTags = [...new Set(searchTerms.tags.toLowerCase().split(',').map(tag => tag.trim()).filter(Boolean))];
      searchTerms.tags = splitTags;
    }
    this.props.result(searchTerms);
    this.setState({
      name: '',
      ingredients: '',
      tags: '',
      error: null
    });
  }

  searchError() {
    if (this.state.error) {
      return <p className="red">{this.state.error}</p>;
    }
  }

  cancel() {
    history.back();
  }

  render() {
    return (
      <div id="search-form-container">
        <form id="search-recipe-form" className="flex-col box-shadow" onSubmit={this.handleSubmit}>
          <label htmlFor="name">Search by recipe name:</label>
          <input name="name" id="recipe-name" onChange={this.handleChange} type="text" value={this.state.name} placeholder="Recipe name" />
          <label htmlFor="ingredients">Search by recipe ingredient:</label>
          <input name="ingredients" id="recipe-ingredient" onChange={this.handleChange} type="text" value={this.state.ingredients} placeholder="Recipe ingredient" />
          <label htmlFor="tags">Search by recipe tags:</label>
          <input name="tags" id="recipe-tag" onChange={this.handleChange} type="text" value={this.state.tags} placeholder="Recipe tag" />
          {this.searchError()}
          <button type="submit">{'SEARCH'}</button>
        </form>
      </div>
    );
  }
}
