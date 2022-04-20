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

  componentDidMount() {
    if (this.props.searchTerms) {
      this.setState({
        name: this.props.searchTerms.name,
        ingredients: this.props.searchTerms.ingredients,
        tags: this.props.searchTerms.tags,
        error: null
      });
    }
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
    if (this.state.ingredients && typeof this.state.ingredients !== 'object') {
      const splitIngs = [...new Set(searchTerms.ingredients.toLowerCase().split(',').map(ing => ing.trim()).filter(Boolean))];
      searchTerms.ingredients = splitIngs;
    }
    if (this.state.tags && typeof this.state.tags !== 'object') {
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
          <input name="ingredients" id="recipe-ingredient" onChange={this.handleChange} type="text" value={this.state.ingredients} placeholder="Ex: bun, tomato, lettuce" />
          <label htmlFor="tags">Search by recipe tags:</label>
          <input name="tags" id="recipe-tag" onChange={this.handleChange} type="text" value={this.state.tags} placeholder="Ex: beef, dairy, gluten" />
          {this.searchError()}
          <div className="flex just-cent col-33">
            <button type="submit">{'SEARCH'}</button>
          </div>
        </form>
      </div>
    );
  }
}
