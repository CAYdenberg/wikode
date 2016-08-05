const React = require('react');

module.exports = (props) => {
  const menuContents = props.user ?
    (
      <ul className="vertical medium-horizontal menu align-right">
        <li>{props.user}</li>
        <li><a href="/user/logout/">Logout</a></li>
        <li><a href="#" onClick={props.showNewWikodeModal}>Create a new document</a></li>
      </ul>
    ) :
    (
      <ul className="vertical medium-horizontal menu align-right">
        <li><a href="#" onClick={props.showSignInModal}>Sign In</a></li>
        <li><a href="#" onClick={props.showCreateUserModal}>Create an account</a></li>
        <li><a href="#" onClick={props.showNewWikodeModal}>Create a new document</a></li>
      </ul>
    )

  return (
    <nav className="top-bar">
      <div className="top-bar-title">
        <a href="/">Wikode</a>
      </div>
      {menuContents}
    </nav>
  );
}
