const React = require('react');
const Nav = require('./Nav');

const actions = require('../../../store/actions.js');

const NavController = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  showSignInModal: function(e) {
    e.preventDefault();
    this.context.store.dispatch(actions.modal('SIGNIN'));
  },

  showCreateUserModal: function(e) {
    e.preventDefault();
    this.context.store.dispatch(actions.modal('CREATE_USER'));
  },

  render: function() {
    return (
      <Nav showSignInModal={this.showSignInModal} showCreateUserModal={this.showCreateUserModal} />
    );
  }
});

module.exports = NavController;
