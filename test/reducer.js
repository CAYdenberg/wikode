/* eslint-env mocha, node */

const assert = require('assert');
const reducer = require('../store/reducer');

const {
  LOGIN,
  LOGOUT,
  SET_UI,
  SAVE_WIKODE,
  FORK_WIKODE,
  NEW_WIKODE
} = require('../store/constants');


describe('Reducer', function() {

  it('should be able to show modals', function() {
    const state = reducer({}, {type: SET_UI, el: 'modal', value: 'my modal'});
    assert.equal(state.ui.modal, 'my modal');
  });

  it('should be able to hide all modals', function() {
    const state = reducer({
      ui: {
        modal: 'my modal'
      }
    }, {type: SET_UI, el: 'modal', value: null});
    assert.equal(state.ui.modal, null);
  });

  it('should log a user in', function() {
    const state = reducer({}, {type: LOGIN, name: 'User Name', hash: 'user-name'});
    assert.equal(state.user.hash, 'user-name');
    assert.equal(state.user.name, 'User Name')
  });

  it('should log a user out', function() {
    const state = reducer({
      user: {
        hash: 'user-name',
        name: 'User Name'
      }
    }, {type: LOGOUT});
    assert.equal(state.user.hash, null);
    assert.equal(state.user.name, null);
  });

  it('should save a wikode by updating the time of last save');

  it('should fork a wikode by assigning it to the current user or to an anonymous user');

  it('should create a new wikode with a title and user');

});
