const React = require('react');

const Field = require('../../lib/UI/Field');
const createFieldControl = require('../../lib').createFieldControl;
const {createUser} = require('../../actions/user');

const CreateUserForm = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      username: '',
      email: '',
      password: '',
      disabled: false
    }
  },

  componentWillMount: function() {
    const store = this.context.store;

    this.usernameControl = createFieldControl(this, 'username', '');
    this.emailControl = createFieldControl(this, 'email', '');
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
    store.dispatch(createUser(this.state.formData));
  },

  render: function() {
    return (
      <form method="POST" action="/user/new/" onSubmit={this._onSubmit}>
        <Field
          label="Username"
          name="signup-username"
          value={this.state.username}
          handleChange={this.usernameControl.handleChange}
        />
        <Field
          type="email"
          label="Email"
          name="signup-email"
          value={this.state.email}
          handleChange={this.emailControl.handleChange}
        />
        <Field
          type="password"
          label="Password"
          name="signup-password"
          value={this.state.password}
          handleChange={this.passwordControl.handleChange}
        />
        <button className="button success" disabled={this.state.disabled}>Sign Up</button>
        <hr />
        <button className="button default">I already have an account</button>
      </form>
    );
  }
});

module.exports = CreateUserForm;
