const React = require('react');

const Field = require('../../lib/UI/Field');
const createFieldControl = require('../../lib').createFieldControl;
const {login} = require('../../actions/user');

const SigninForm = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      username: '',
      password: '',
      disabled: false
    }
  },

  componentWillMount: function() {
    const store = this.context.store;

    this.usernameControl = createFieldControl(this, 'username', '');
    this.passwordControl = createFieldControl(this, 'password', '');

    store.subscribe(() => {
      this.setState({
        disabled: false
      });
    });
  },

  _onSubmit: function(e) {
    e.preventDefault();
    this.setState({
      disabled: true
    });
    const store = this.context.store;
    store.dispatch(login(this.state.formData));
  },

  render: function() {
    return (
      <form method="POST" action="/user/login/" onSubmit={this._onSubmit}>
        <Field
          label="Username"
          name="signin-username"
          value={this.state.username}
          handleChange={this.usernameControl.handleChange}
        />
        <Field
          type="password"
          label="Password"
          name="signin-password"
          value={this.state.password}
          handleChange={this.passwordControl.handleChange}
        />
        <button className="button success" type="submit" disabled={this.state.disabled}>Sign In</button>
      </form>
    );
  }
});

module.exports = SigninForm;
