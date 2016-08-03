const React = require('react');
const Nav = require('./Nav');

const actions = require('../../../store/actions.js');

// TODO: replace this with connect

const NavController = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      user: this.context.store.getState().user.name
    }
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        user: store.getState().user.name
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
