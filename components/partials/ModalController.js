const React = require('react');

const hideModals = require('../../store/actions').hideModals;

// TODO: replace this with connect

const Modal = require('../../lib/UI/Modal');
const CreateUserForm = require('../CreateUserForm');
const SigninForm = require('../SigninForm');
const NewWikodeForm = require('../NewWikodeForm');

const MODALS = [
  {name: 'CREATE_USER', title: 'Create your account', body: (<CreateUserForm />)},
  {name: 'SIGNIN', title: 'Sign in to your account', body: (<SigninForm />)},
  {name: 'NEW_WIKODE', title: 'Create a new Wikode', body: (<NewWikodeForm />)}
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
      <div>
        {MODALS.map(modal =>
          <Modal key={modal.name} title={modal.title} visible={this.modalIsVisible(modal.name)} hide={this.hideModals}>
            {modal.body}
          </Modal>
        )}
      </div>
    );
  }
});

module.exports = ModalController;
