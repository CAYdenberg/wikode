const React = require('react');

module.exports = (props) => {

  return (
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
  );

};
