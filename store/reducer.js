const update = require('react-addons-update');

function ui(state, action) {
  switch(action.type) {

    case 'SAVING':
      return update(state, {
        $merge: {save: 'WORKING'}
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
      modal: '',
      signinForm: {
        errors: []
      },
      createUserForm: {
        errors: []
      }
    }
  }, initialState);

  return update(state, {


    ui: {$merge: ui(state.ui, action)}
  });


}
