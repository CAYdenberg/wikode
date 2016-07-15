const React = require('react');

const update = require('react-addons-update');

const TextField = require('../partials/TextField');
const HiddenField = require('../partials/HiddenField');

const createUserSubmit = require('../../store/actions').createUserSubmit;

const CreateUserForm = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const appState = this.context.store.getState();
    return {
      formMsg: appState.createUserForm || '',

      formData: {
        hash: appState.user.hash
      },

      usernameMsg: appState.uniqueUsername || ''
    };
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        validationData: {
          'signup-username': store.getState().uniqueUsername
        },
        formMsg: store.getState().createUserForm
      });
    });
  },

  update: function(e) {
    var updateObj = {};
    updateObj[e.target.id] = e.target.value;
    this.setState({
      formData: update(this.state.formData, {$merge: updateObj})
    });
  },

  checkUsername: function(value) {
    this.setState({
      usernameMsg: (() => {
        if (!value) {
          return 'Username is required'
        } else if (value === 'user') {
          return 'Username cannot be "user"'
        } else {
          return '';
        }
      })()
    });
    return !!this.state.username;
  },

  checkEmail: function() {
    //TODO: validation this
    return true;
  },

  checkPassword: function() {
    //TODO: validate this
    return true;
  },

  handleSubmit: function(e) {
    e.preventDefault();
    const store = this.context.store;
    store.dispatch(createUserSubmit(this.state.formData, store));
  },

  render: function() {
    return (
      <form method="POST" action="/user/new/" onSubmit={this.handleSubmit}>
        <HiddenField
          name="hash"
          formData={this.state.formData}
        />
        <TextField
          label="Username"
          name="signup-username"
          formData={this.state.formData}
          valid={this.state.usernameMsg}
          change={this.update}
          check={this.checkUsername}
        />
        <TextField
          type="email"
          label="Email"
          name="signup-email"
          formData={this.state.formData}
          change={this.update}
          valid={this.state.emailMsg}
          check={this.checkEmail}
        />
        <TextField
          type="password"
          label="Password"
          name="signup-password"
          formData={this.state.formData}
          change={this.update}
          valid={this.state.passwordMsg}
          check={this.checkPassword}
        />
        <button className="button success">Sign Up</button>
        <hr />
        <button className="button default">I already have an account</button>
      </form>
    );
  }
});

module.exports = CreateUserForm;
