/* eslint-env mocha, node */

const assert = require('assert');
const reducer = require('../store/reducer');

const {
  SAVE_WIKODE,
  SET_MODAL,
  SET_MESSAGE
} = require('../store/constants');


describe('Reducer', function() {

  it('should save a wikode by updating the time of last save', function() {
    const state = reducer({
      wikode: {
        user: 'user-name',
        title: 'My Wikode',
        slug: 'my-wikode',
        content: 'Some content goes here',
        datetime: 1000
      }
    }, {type: SAVE_WIKODE, datetime: 2000});
    assert.equal(state.wikode.datetime, 2000);
    assert.equal(state.wikode.title, 'My Wikode');
    assert.equal(state.ui.message, 'The document was successfully saved');
  });

  it('should set the value of the currently open modal', function() {
    const state = reducer({
      ui: {
        modal: null
      }
    }, {type: SET_MODAL, value: 'loginModal'});
    assert.equal(state.ui.modal, 'loginModal');
  });

  it('should set the currently displayed message', function() {
    const state = reducer({},
      {type: SET_MESSAGE, message: 'A new message for the user'}
    );
    assert.equal(state.ui.message, 'A new message for the user');
  });

});
