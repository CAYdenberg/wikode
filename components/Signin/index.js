const React = require('react');

const Signin = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitalState: function() {

  },

  componentWillMount: function() {

  },

  render: function() {
    return (
      <a href="/auth/twitter">Signin With Twitter</a>
    );
  }
});

module.exports = Signin;
