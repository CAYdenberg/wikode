const React = require('react');

module.exports = (props) => {
  return (
    <nav className="top-bar">
      <div className="top-bar-title">
        <a href="/">Wikode</a>
      </div>
      <ul className="vertical medium-horizontal menu align-right">
        <li>
          <a href="/login/">Login</a>
        </li>
        <li>
          <a href="#" onClick={props.showNewWikodeModal}>New</a>
        </li>
      </ul>
    </nav>
  );
}
