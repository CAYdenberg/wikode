const React = require('react');

const Nav = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const state = this.context.store.getState();
    console.log(state);
    return {
      user: state.user,
      newWikodeModal: false,
      loginModal: false
    };
  },

  _showNewWikodeModal: function() {

  },

  _showLoginModal: function() {

  },

  render: function() {
    const login = this.state.user ?
      (<a href="/logout">Logout</a>) :
      (<a href="/login">Login</a>);

    return (
      <nav className="top-bar">
        <div className="top-bar-title">
          <a href="/">Wikode</a>
        </div>
        <ul className="vertical medium-horizontal menu align-right">
          <li>
            {login}
          </li>
          <li>
            <a href="#" onClick={this._showNewWikodeModal}>New</a>
          </li>
        </ul>
      </nav>
    );
  }
});

module.exports = Nav;
