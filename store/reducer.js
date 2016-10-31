const update = require('react-addons-update');

function user(state, action) {
  switch (action.type) {

    case 'SWITCH_USER':
      return {hash: action.hash, name: action.name}

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

    case 'SET_UI':
      var updateObj = {};
      updateObj[action.el] = {$set: action.value};
      return update(state, updateObj);

    case 'SWITCH_USER':
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
      createUserForm: null,
      uniqueUsername: null
    }
  }, initialState);

  return update(state, {
    user: {$set: user(state.user, action)},
    wikode: {$merge: wikode(state.wikode, action)},
    ui: {$merge: ui(state.ui, action)}
  });

}
