const React = require('react');

module.exports = () => {
  return (
    <div>
      <nav className="top-bar">
        <div className="top-bar-title">
          <a href="/">Site Title</a>
        </div>
        <ul className="menu align-right">
          <li><button type="submit" className="button success">Sign In</button></li>
          <li><a href="#" className="button warning">Create an account</a></li>
        </ul>
      </nav>

      <div className="reveal-overlay">
        <div className="reveal">
          <h2>Sign Up</h2>
          <hr />
          <form>
            <label>
              Username
              <input type="text" name="signup-username" />
            </label>
            <label>
              Email Address
              <input type="email" name="signup-email" />
            </label>
            <label>
              Password
              <input type="password" name="signup-password" />
            </label>
            <button className="button success">Sign Up</button>
            <hr />
            <button className="button default">I already have an account</button>
          </form>
        </div>
        <div className="reveal">
          <h2>Sign In</h2>
          <form>
            <label>
              Username or Email
              <input type="text" name="signin username" />
            </label>
            <label>
              Password
              <input type="password" name="signin-password" />
            </label>
            <button className="button success">Sign In</button>
          </form>
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
