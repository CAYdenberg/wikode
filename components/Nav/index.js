const React = require('react');
const Nav = require('./Nav');

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
