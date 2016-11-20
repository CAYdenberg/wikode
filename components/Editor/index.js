const React = require('react');
const View = require('./view');

// TODO: replace with connect

const Editor = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      title: this.context.store.getState().wikode.title
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
      />
    );
  }
});

module.exports = Editor;
