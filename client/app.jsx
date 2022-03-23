import React from 'react';
import Home from './pages/home';
import AddRecipe from './pages/add-recipe';
import ViewRecipes from './pages/view-recipes';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      route: parseRoute(location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(location.hash)
      });
    });
  }

  renderPage() {
    const { route } = this.state;

    if (route.path === '') {
      return <Home/>;
    }
    if (route.path === 'add-recipe') {
      return <AddRecipe />;
    }
    if (route.path === 'view-recipes') {
      return <ViewRecipes />;
    }
    return <h1>404 Page not found!</h1>;
  }

  render() {
    return (
      <>
        {this.renderPage()}
      </>
    );
  }
}
