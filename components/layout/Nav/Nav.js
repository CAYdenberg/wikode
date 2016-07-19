const React = require('react');

module.exports = (props) => {
  const menuContents = props.user ?
    (
      <ul className="menu align-right">
        <li>{props.user}</li>
        <li><a href="/user/logout/" className="button warning">Logout</a></li>
      </ul>
    ) :
    (
      <ul className="menu align-right">
        <li><a href="#" className="button success" onClick={props.showSignInModal}>Sign In</a></li>
        <li><a href="#" className="button warning" onClick={props.showCreateUserModal}>Create an account</a></li>
      </ul>
    )

  return (
    <nav className="top-bar">
      <div className="top-bar-title">
        <a href="/">Site Title</a>
      </div>
      {menuContents}
    </nav>
  );
}
