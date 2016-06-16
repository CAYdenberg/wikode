const React = require('react');

const CreateUserForm = (props) => {
  return (
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
  );
}

module.exports = CreateUserForm;
