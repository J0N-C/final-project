import React from 'react';
import AppContext from './lib/app-context';
import Home from './pages/home';
import MainHeader from './components/main-header';
import AddRecipe from './pages/add-recipe';
import ViewRecipes from './pages/view-recipes';
import SearchRecipes from './pages/search-recipes';
import Navbar from './components/navbar';
import Auth from './pages/auth.jsx';
import decodeToken from './lib/decode-token';
import { parseRoute } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(location.hash)
      });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { route } = this.state;

    if (route.path === '') {
      return <Home/>;
    }
    if (route.path === 'sign-in' || route.path === 'sign-up') {
      return <Auth />;
    }
    if (route.path === 'add-recipe') {
      return <AddRecipe />;
    }
    if (route.path === 'view-recipes') {
      return <ViewRecipes />;
    }
    if (route.path === 'view-recipe') {
      const recipeId = parseInt(route.params.get('recipeId'));
      return <ViewRecipes recipeId={recipeId} />;
    }
    if (route.path === 'edit-recipe') {
      const recipeId = parseInt(route.params.get('recipeId'));
      return <ViewRecipes recipeId={recipeId} editing={true} />;
    }
    if (route.path === 'search-recipes') {
      return <SearchRecipes />;
    }
    return <h1>404 Page not found!</h1>;
  }

  render() {
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <MainHeader location={parseRoute(location.hash)} />
        {this.renderPage()}
        <Navbar />
      </AppContext.Provider>
    );
  }
}
