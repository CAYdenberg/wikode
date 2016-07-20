const React = require('react');

const TextField = require('../partials/TextField');
const HiddenField = require('../partials/HiddenField');

const actions = require('../../store/actions');

const update = require('react-addons-update');

const SigninForm = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const appState = this.context.store.getState();
    return {

      formMsg: appState.ui.SigninForm,

      formData: {
        hash: appState.user.hash
      },

      disabled: false

    }
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        formMsg: store.getState().ui.SigninForm,
        disabled: false
      });
    })
  },

  update: function(e) {
    var updateObj = {};
    updateObj[e.target.id] = e.target.value;
    this.setState({
      formData: update(this.state.formData, {$merge: updateObj})
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({
      disabled: true
    });
    const store = this.context.store;
    store.dispatch(actions.login(this.state.formData));
  },

  render: function() {
    return (
      <form method="POST" action="/user/login/" onSubmit={this.handleSubmit}>
        <h3>{this.state.formMsg}</h3>
        <HiddenField
          name="hash"
          formData={this.state.formData}
        />
        <TextField
          label="Username"
          name="signin-username"
          formData={this.state.formData}
          change={this.update}
        />
        <TextField
          type="password"
          label="Password"
          name="signin-password"
          formData={this.state.formData}
          change={this.update}
        />
        <button className="button success" type="submit" disabled={this.state.disabled}>Sign In</button>
      </form>
    );
  }
});

module.exports = SigninForm;
