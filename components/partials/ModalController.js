const React = require('react');

const hideModals = require('../../store/actions').hideModals;

const Modal = require('../partials/Modal');
const CreateUserForm = require('../CreateUserForm');
const SigninForm = require('../SigninForm');

const MODALS = [
  {name: 'CREATE_USER', title: 'Create your account', body: (<CreateUserForm />)},
  {name: 'SIGNIN', title: 'Sign in to your account', body: (<SigninForm />)}
]

const ModalController = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      modal: this.context.store.getState().ui.modal
    }
  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        modal: store.getState().ui.modal
      });
    });
  },

  modalIsVisible: function(modal) {
    if (modal) {
      return (modal === this.state.modal);
    }
    return false;
  },

  hideModals: function() {
    this.context.store.dispatch(hideModals());
  },

  render: function() {
    return (
      <div className="reveal-overlay" aria-hidden={this.state.modal ? 'false' : 'true'} onClick={this.hideModals}>
        {MODALS.map(modal =>
          <Modal key={modal.name} title={modal.title} visible={this.modalIsVisible(modal.name)}>
            {modal.body}
          </Modal>
        )}
      </div>
    );
  }
});

module.exports = ModalController;
