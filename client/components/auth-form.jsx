import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.demoSubmit = this.demoSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    if (action === 'sign-up' && (!this.state.username || !this.state.password || !this.state.firstName || !this.state.lastName)) {
      return this.setState({ error: 'Please fill in all fields!' });
    }
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/auth/${action}`, req)
      .then(res => res.json())
      .then(result => {
        if (result.error === 'invalid login') {
          return this.setState({ error: 'Invalid login!' });
        }
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        } else if (result.user && result.token) {
          this.props.onSignIn(result);
        }
      });
  }

  demoSubmit(event) {
    this.setState({
      username: 'demo_user@faketestmail.com',
      password: 'Fakepass123'
    },
    () => { this.handleSubmit(event); }
    );
  }

  passwordError() {
    if (this.state.error) {
      return <p className="red">{this.state.error}</p>;
    }
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternatActionText = action === 'sign-up'
      ? 'Sign in instead'
      : 'Register now';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const registerForm = action === 'sign-up'
      ? ''
      : 'hidden';
    const demoLogin = action === 'sign-in'
      ? ''
      : 'hidden';
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            Email
          </label>
          <input
            required
            id="username"
            type="email"
            name="username"
            onChange={handleChange}
            value={this.state.username} />
        </div>
        <div className={registerForm}>
          <div>
            <label htmlFor="firstName">
              First Name
            </label>
            <input
              required
              id="firstName"
              type="text"
              name="firstName"
              onChange={handleChange}
              value={this.state.firstName} />
          </div>
          <div>
            <label htmlFor="lastName">
              Last Name
            </label>
            <input
              required
              id="lastName"
              type="text"
              name="lastName"
              onChange={handleChange}
              value={this.state.lastName} />
          </div>
        </div>
        <div>
          <label htmlFor="password">
            Password
          </label>
          <input
            required
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            value={this.state.password} />
        </div>
        {this.passwordError()}
        <div>
          <button type="button" className={`tags ${demoLogin}`} onClick={this.demoSubmit}>
            Sign In as Demo User
          </button>
        </div>
        <div className="flex just-btwn">
          <div>
            <a className="tags" href={alternateActionHref}>
              {alternatActionText}
            </a>
          </div>
          <button onClick={this.handleSubmit}>
            { submitButtonText }
          </button>
        </div>
      </form>
    );
  }
}
