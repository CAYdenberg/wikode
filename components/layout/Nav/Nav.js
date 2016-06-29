const React = require('react');

module.exports = (props) => {
  return (
    <nav className="top-bar">
      <div className="top-bar-title">
        <a href="/">Site Title</a>
      </div>
      <ul className="menu align-right">
        <li><a href="#" className="button success" onClick={props.showSignInModal}>Sign In</a></li>
        <li><a href="#" className="button warning" onClick={props.showCreateUserModal}>Create an account</a></li>
      </ul>
    </nav>
  );
}
