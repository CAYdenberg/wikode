const React = require('react');

const Modal = require('./partials/Modal');
const LoginForm = require('./Login');
const NewWikodeForm = require('./NewWikode');

const ModalController = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const state = this.context.store.getState();
    return {
      modal: state.ui.modal
    };
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        modal: store.getState().ui.modal
      });
    });
  },

  _hide: function() {
    this.context.store.action('closeModals');
  },

  render: function() {
    return (
      <div>

        <Modal title="Login to continue" hide={this._hide} visible={this.state.modal === 'login'}>
          <LoginForm />
        </Modal>

        <Modal title="Create a new Wikode" hide={this._hide} visible={this.state.modal === 'newWikode'}>
          <NewWikodeForm />
        </Modal>

      </div>
    );
  }

});

module.exports = ModalController;
