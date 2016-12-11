const React = require('react');

const newWikode = require('../../actions/wikode').new;
const Field = require('../../lib/UI/Field');
const createFieldControl = require('../../lib').createFieldControl;


const NewWikodeForm = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getUserHash: function() {
    return this.context.store.getState().user;
  },

  getInitialState: function() {
    return {
      title: ''
    };
  },

  componentWillMount: function() {
    this.titleControl = createFieldControl(this, 'title', '');
  },

  _onSubmit: function(e) {
    e.preventDefault();
    const userHash = this.getUserHash();
    const title = this.state.title;
    this.context.store.dispatch(newWikode(title, userHash));
  },

  render: function() {
    return (
      <form method="POST" action="/" onSubmit={this._onSubmit}>
        <Field
          name="new-wikode-title"
          label="Document title"
          handleChange={this.titleControl.handleChange}
          value={this.state.title}
        />
        <button className="button success" type="submit">Create</button>
      </form>
    );
  }
});

module.exports = NewWikodeForm;
