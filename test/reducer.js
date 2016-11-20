/* eslint-env mocha, node */

const assert = require('assert');
const reducer = require('../store/reducer');

const {
  LOGIN,
  LOGOUT,
  SET_UI,
  NEW_WIKODE,
  FORK_WIKODE,
  SAVE_WIKODE,
  POPULATE_WIKODE
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
  });

  it('should get a local wikode based on slug', function() {
    const state = reducer({
      wikode: {
        user: 'local',
        slug: 'my-local-wikode'
      }
    }, {type: POPULATE_WIKODE, title: 'My Local Wikode', content: 'Some content'});
    assert.equal(state.wikode.content, 'Some content');
  });

  it('should create a new wikode based on user and title (and slug)', function() {
    const state = reducer({
      wikode: {
        user: 'old user',
        slug: 'old-wikode'
      }
    }, {type: NEW_WIKODE, title: 'New Wikode', user: 'new-user', slug: 'new-wikode'});
    assert.equal(state.wikode.slug, 'new-wikode');
    assert.equal(state.wikode.user, 'new-user');
  });

  it('should fork a wikode and assign it to a new user', function() {
    const state = reducer({
      wikode: {
        user: 'old-user',
        slug: 'old-wikode'
      }
    }, {type: FORK_WIKODE, user: 'new-user'});
    assert.equal(state.wikode.slug, 'old-wikode');
    assert.equal(state.wikode.user, 'new-user');
  });

});
