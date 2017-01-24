const React = require('react');

const Modal = require('../partials/Modal');
const LoginForm = require('../Login');
const NewWikodeForm = require('../NewWikode');

const Nav = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const state = this.context.store.getState();
    return {
      user: state.user,
      newWikodeModal: false,
      loginModal: false
    };
  },

  _toggleNewWikodeModal: function(e) {
    e.preventDefault();
    this.setState({
      newWikodeModal: !this.state.newWikodeModal
    });
  },

  _toggleLoginModal: function(e) {
    e.preventDefault();
    this.setState({
      loginModal: !this.state.loginModal
    });
  },

  render: function() {
    const login = this.state.user ?
      (<a href="/logout">Logout</a>) :
      (<a href="/login" onClick={this._toggleLoginModal}>Login</a>);

    const newDocument = this.state.user ?
      (<a href="/new" onClick={this._toggleNewWikodeModal}>New</a>) :
      (<a href="/login" onClick={this._toggleLoginModal}>New</a>);

    return (
      <nav className="top-bar">

        <div className="top-bar-title">
          <a href="/">Wikode</a>
        </div>
        <ul className="vertical medium-horizontal menu align-right">
          <li>
            {newDocument}
          </li>
          <li>
            {login}
          </li>
        </ul>

        <Modal title="Login to continue" hide={this._toggleLoginModal} visible={this.state.loginModal}>
          <LoginForm />
        </Modal>

        <Modal title="Create a new Wikode" hide={this._toggleNewWikodeModal} visible={this.state.newWikodeModal}>
          <NewWikodeForm />
        </Modal>

      </nav>
    );
  }
});

module.exports = Nav;
