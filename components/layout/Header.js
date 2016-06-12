const React = require('react');

module.exports = () => {
  return (
    <header>
      <nav className="top-bar">
        <div className="top-bar-title">
          <a href="/">Site Title</a>
        </div>
        <ul className="menu align-right">
          <li><button type="submit" className="button success">Sign In</button></li>
          <li><a href="#" className="button warning">Create an account</a></li>
        </ul>
      </nav>
    </header>
  );
}
