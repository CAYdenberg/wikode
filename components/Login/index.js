const React = require('react');

const Login = () => {
  return (
    <div className="login-form">
      <a href="/auth/twitter" className="button large secondary">
        <i className="icon-twitter"></i> | Signin with Twitter
      </a>
    </div>
  );
}

module.exports = Login;
