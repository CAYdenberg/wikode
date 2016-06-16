const React = require('react');

const Modal = require('../partials/Modal');
const CreateUserForm = require('../CreateUserForm');
const SigninForm = require('../SigninForm');

module.exports = (props) => {

  return (
    <footer>

      <div className="reveal-overlay">

        <Modal title="Create your account">
          <CreateUserForm />
        </Modal>

        <Modal title="Sign in to your account">
          <SigninForm />
        </Modal>

      </div>

    </footer>
  );
}
