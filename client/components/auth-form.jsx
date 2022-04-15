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
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
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
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        } else if (result.user && result.token) {
          this.props.onSignIn(result);
        }
      });
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
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            Username
          </label>
          <input
            required
            autoFocus
            id="username"
            type="text"
            name="username"
            onChange={handleChange} />
        </div>
        <div className={registerForm}>
          <div>
            <label htmlFor="firstName">
              First Name
            </label>
            <input
              required
              autoFocus
              id="firstName"
              type="text"
              name="firstName"
              onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="lastName">
              Last Name
            </label>
            <input
              required
              autoFocus
              id="lastName"
              type="text"
              name="lastName"
              onChange={handleChange} />
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
            onChange={handleChange} />
        </div>
        <div className="flex just-btwn">
          <div>
            <a className="tags" href={alternateActionHref}>
              {alternatActionText}
            </a>
          </div>
          <button type="submit">
            { submitButtonText }
          </button>
        </div>
      </form>
    );
  }
}
