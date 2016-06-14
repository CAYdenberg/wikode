/**

State = {
  userHash: String,
  editMode = Boolean
  wikode: {
    userHash: String,
    slug: String,
    content: {EditorContent}
  },
  ui: {
    editorControls {
      save: 'AVAILABLE' | 'WORKING' | 'ERROR',
    },
    modal: false | 'signin' | 'createUser',
    signinError: null | String,
    createUserError: null | String
  }
}
*/

const update = require('react-addons-update');

module.exports = function(initialState, action) {
  const state = Object.assign({
    userHash: '',
    editMode: false,
    wikode: {
      userHash: '',
      slug: '',
      content: {}
    },
    ui: {
      editorControls: {
        saveBtn: 'AVAILABLE'
      },
      modal: '',
      signinError: '',
      createUserError: ''
    }
  }, initialState);

  switch(action.type) {
    case 'SAVING':
      return update(state, {ui: {
        $merge: {save: 'WORKING'}
      }});

    default:
      return state;
  }

}
