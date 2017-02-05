const React = require('react');

const Message = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  expireAfter: 5000,

  _getMessage: function() {
    const message = this.state.messages.reverse()[0] || null;
    if (!message) return;
    if (message && message.timestamp > (Date.now() - this.expireAfter)) {
      return message.message;
    } else {
      return null;
    }
  },

  getInitialState: function() {
    const state = this.context.store.getState();
    return {
      messages: state.ui.messages
    }
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        messages: store.getState().ui.messages
      })
      setTimeout(() => this.forceUpdate(), this.expireAfter);
    });
  },

  shouldComponentUpdate: function() {
    return true;
  },

  render: function() {
    const message = this._getMessage();
    return message ?
    (
      <div className="notification-wrapper">
        <p className="notification">{message}</p>
      </div>
    ) :
    (<div />);
  }

});

module.exports = Message;
