const React = require('react');

const TextField = require('../partials/TextField');

const newWikode = require('../../actions/wikode').new;

const NewWikodeForm = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getUserHash: function() {
    const user = this.context.store.getState().user;
    return user ? user.hash : null;
  },

  getInitalState: function() {

  },

  componentWillMount: function() {

  },

  _onSubmit: function(e) {
    e.preventDefault();
    const userHash = this.getUserHash();
    const title = document.getElementById('new-wikode-title').value;
    this.context.store.dispatch(newWikode(title, userHash));
  },

  render: function() {
    return (
      <form method="POST" action="/" onSubmit={this._onSubmit}>
        <div>
          <label>Document title
            <input type="text" name="new-wikode-title" id="new-wikode-title" />
          </label>
        </div>
        <button className="button success" type="submit">Create</button>
      </form>
    );
  }
});

module.exports = NewWikodeForm;
