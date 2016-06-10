const React = require('react');

module.exports = () => {
  return (
    <div>
      <nav className="top-bar">
        <div class="top-bar-title">
          <a href="/">Site Title</a>
        </div>
        <ul className="menu align-right">
          <li><button type="submit" className="button success">Sign In</button></li>
          <li><a href="#" className="button warning">Create an account</a></li>
        </ul>
      </nav>

      <div className="reveal-overlay" style={{display: "block"}}>
        <div className="reveal" style={{display: "block"}}>
          <h2>The sign up form</h2>
          <form>
          </form>
        </div>
        <div className="reveal">
          <h2>The sign in form</h2>
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
