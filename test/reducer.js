/* eslint-env mocha, node */

const assert = require('assert');

const reducer = require('../store/reducer');

describe('Reducer', function() {

  it('should be able to show modals', function() {
    const state = reducer({}, {type: 'SET_UI', el: 'modal', value: 'my modal'});
    assert.equal(state.ui.modal, 'my modal');
  });

  it('should be able to hide all modals', function() {
    const state = reducer({
      ui: {
        modal: 'my modal'
      }
    }, {type: 'SET_UI', el: 'modal', value: null});
    assert.equal(state.ui.modal, null);
  });

  it('should be able to change the user', function() {
    const state = reducer({}, {type: 'SWITCH_USER', hash: 'abcd1234', name: 'user1'});
    assert.equal(state.user.hash, 'abcd1234');
    assert.equal(state.user.name, 'user1');
  });

  it('should clear all errors from the createUserForm and the signinForm when the user changes', function() {
    const state = reducer({
      ui: {
        createUserForm: 'User could not be created',
        signinForm: 'Error message'
      }
    }, {type: 'SWITCH_USER'});
    assert.equal(state.ui.createUserForm, null);
    assert.equal(state.ui.signinForm, null);
  });


});
