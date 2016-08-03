const React = require('react');

const TextField = require('../partials/TextField');

const NewWikodeForm = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitalState: function() {

  },

  componentWillMount: function() {

  },

  render: function() {
    return (
      <form method="POST" action="/">
        <div>
          <label>Document title
            <input type="text" name="new-wikode-title" />
          </label>
        </div>
        <button className="button success" type="submit">Create</button>
      </form>
    );
  }
});

module.exports = NewWikodeForm;
