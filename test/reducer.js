/* eslint-env mocha, node */

const assert = require('assert');

const reducer = require('../store/reducer');

describe('Reducer', function() {

  it('should be able to show modals', function() {
    const state = reducer({}, {type: 'MODAL', name: 'My modal'});
    assert.equal(state.ui.modal, 'My modal');
  });

  it('should be able to hide all modals', function() {
    const state = reducer({}, {type: 'MODAL', name: null});
    assert.equal(state.ui.modal, null);
  });

})
