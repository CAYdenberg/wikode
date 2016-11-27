const React = require('react');
const Nav = require('./Nav');

const actions = require('../../../store/actions.js');

// TODO: replace this with connect

const NavController = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getUserName: function() {
    return this.context.store.getState().user;
  },

  getInitialState: function() {
    return {
      user: this.getUserName()
    }
  },

  componentWillMount: function() {
    this.context.store.subscribe(() => {
      this.setState({
        user: this.getUserName()
      });
    })
  },

  showSignInModal: function(e) {
    e.preventDefault();
    this.context.store.dispatch(actions.modal('SIGNIN'));
  },

  showCreateUserModal: function(e) {
    e.preventDefault();
    this.context.store.dispatch(actions.modal('CREATE_USER'));
  },

  showNewWikodeModal: function(e) {
    e.preventDefault(e);
    this.context.store.dispatch(actions.modal('NEW_WIKODE'));
  },

  render: function() {
    return (
      <Nav
        showSignInModal={this.showSignInModal}
        showCreateUserModal={this.showCreateUserModal}
        showNewWikodeModal={this.showNewWikodeModal}
        user={this.state.user}
      />
    );
  }
});

module.exports = NavController;
