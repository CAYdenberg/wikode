const React = require('react');

const Nav = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const state = this.context.store.getState();
    return {
      user: state.user,
      collapsed: true,
      newWikodeModal: false,
      loginModal: false
    };
  },

  _toggleCollapsed: function(e) {
    e.preventDefault();
    this.setState({
      collapsed: !this.state.collapsed
    });
  },

  _toggleNewWikodeModal: function(e) {
    e.preventDefault();
    this.context.store.action('openModal', 'newWikode');
  },

  _toggleLoginModal: function(e) {
    e.preventDefault();
    this.context.store.action('openModal', 'login');
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
        <div className="align-right hide-for-medium">
          <button onClick={this._toggleCollapsed}>MENU</button>
        </div>
        <ul className={'vertical medium-horizontal menu align-right medium-collapse ' + (this.state.collapsed ? '' : 'in')}>
          <li>
            {newDocument}
          </li>
          <li>
            {login}
          </li>
        </ul>

      </nav>
    );
  }
});

module.exports = Nav;
