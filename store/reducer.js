const update = require('react-addons-update');
const {
  LOGIN,
  LOGOUT,
  SET_UI,
  NEW_WIKODE,
  FORK_WIKODE,
  SAVE_WIKODE,
  POPULATE_WIKODE
} = require('./constants');

function user(state, action) {
  switch (action.type) {

    case LOGIN:
      return {hash: action.hash, name: action.hash}

    case LOGOUT:
      return {hash: null, name: null}

    default:
      return state;

  }
}

function wikode(state, action) {
  switch(action.type) {

    case SAVE_WIKODE:
      return update(state, {$merge: {
        datetime: action.datetime
      }});

    case POPULATE_WIKODE:
      return update(state, {$merge: {
        datetime: action.datetime,
        title: action.title,
        content: action.content
      }});

    case NEW_WIKODE:
      return {
        user: action.user,
        title: action.title,
        slug: action.slug
      };

    case FORK_WIKODE:
      return update(state, {$set: {
        user: action.user
      }});

    default:
      return state;

  }
}

function ui(state, action) {
  switch(action.type) {

    case SET_UI:
      var updateObj = {};
      updateObj[action.el] = {$set: action.value};
      return update(state, updateObj);

    case LOGIN:
      return update(state, {
        signinForm: {$set: null},
        createUserForm: {$set: null},
        modal: {$set: null}
      });

    default:
      return state;

  }
}

module.exports = function(initialState, action) {
  const state = Object.assign({
    user: {
      hash: null,
      name: null
    },
    wikode: {
      user: '',
      title: '',
      slug: '',
      content: {},
      lastSave: ''
    },
    ui: {
      modal: null,
      signinForm: null,
      createUserForm: null
    }
  }, initialState);

  return update(state, {
    user: {$set: user(state.user, action)},
    wikode: {$merge: wikode(state.wikode, action)},
    ui: {$merge: ui(state.ui, action)}
  });

}
