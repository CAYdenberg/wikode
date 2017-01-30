const React = require('react');

const Message = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const state = this.context.store.getState();
    return {
      message: state.ui.message
    }
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        message: store.getState().ui.message
      })
    })
  },

  render: function() {
    return this.state.message ?
    (
      <div className="notification-wrapper">
        <p className="notification">{this.state.message}</p>
      </div>
    ) :
    (<div />);
  }

});

module.exports = Message;
