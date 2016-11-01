const update = require('react-addons-update');
const {
  LOGIN,
  LOGOUT,
  SET_UI,
  SAVE_WIKODE,
  FORK_WIKODE,
  NEW_WIKODE
} = require('./constants');

function user(state, action) {
  switch (action.type) {

    case LOGIN:
      return {hash: action.hash, name: action.name}

    case LOGOUT:
      return {hash: null, name: null}

    default:
      return state;

  }
}

function wikode(state, action) {
  switch(action.type) {

    case 'SAVED':
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
      userHash: '',
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
