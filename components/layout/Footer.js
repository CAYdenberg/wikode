const React = require('react');

module.exports = () => {
  return (
    <footer>

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

    </footer>
  );
}
