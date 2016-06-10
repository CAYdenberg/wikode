const React = require('react');

module.exports = () => {
  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-left">
          <ul className="dropdown menu" data-dropdown-menu>
            <li><a href="/">LOGO</a></li>
          </ul>
        </div>
        <div className="top-bar-right">
          <ul className="vertical medium-horizontal menu">
            <li><input type="text" placeholder="Username or email" /></li>
            <li><input type="password"  placeholder="Placeholder" /></li>
            <li>
              <button type="submit" className="button primary">Submit</button>
              <a href="#" className="button warning">Create an account</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="column row">
        <h1>Home/splash page</h1>
        <form action="." method="POST">
          <button type="submit" className="button primary">Create a new document</button>
        </form>
      </div>
    </div>
  );
}
