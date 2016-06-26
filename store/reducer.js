const update = require('react-addons-update');


function wikode(state, action) {
  switch(action.type) {

    case 'SAVED':
    default:
      return state;

  }
}

function ui(state, action) {
  switch(action.type) {

    case 'MODAL':
      return update(state, {
        modal: {$set: action.name}
      });

    default:
      return state;

  }
}

module.exports = function(initialState, action) {
  const state = Object.assign({
    userHash: '',
    editMode: false,
    wikode: {
      userHash: '',
      slug: '',
      content: {},
      lastSave: ''
    },
    ui: {
      modal: null,
      signinForm: {
        errors: []
      },
      createUserForm: {
        errors: []
      }
    }
  }, initialState);

  return update(state, {

    wikode: {$merge: wikode(state.wikode, action)},
    ui: {$merge: ui(state.ui, action)}
  });


}
