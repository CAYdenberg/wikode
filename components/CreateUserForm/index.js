const React = require('react');

const Form = require('../../lib/UI/Form');
const TextField = require('../../lib/UI/Field');

const {createUser} = require('../../actions/user');

const CreateUserForm = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const appState = this.context.store.getState();
    return {
      formMsg: appState.ui.createUserForm || '',

      formData: {},

      usernameMsg: appState.uniqueUsername || '',

      disabled: false
    };
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        formMsg: store.getState().ui.createUserForm,
        disabled: false
      });
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
    this.setState({
      disabled: true
    });
    const store = this.context.store;
    store.dispatch(createUser(this.state.formData));
  },

  render: function() {
    return (
      <Form>
        <TextField name="signup-username" label="Username" />
      </Form>
    );
  }
});

module.exports = CreateUserForm;
