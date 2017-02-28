const React = require('react');
const View = require('./View');

// TODO: replace with connect

const Editor = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const state = this.context.store.getState();
    return {
      title: this.context.store.getState().wikode.title,
      editMode: (state.wikode.user === state.user)
    };
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        title: store.getState().wikode.title
      });
    });
  },

  render: function() {
    return (
      <View
        title={this.state.title}
        editMode={this.state.editMode}
      />
    );
  }
});

module.exports = Editor;
