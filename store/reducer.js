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
      saveButton: 'AVAILABLE' | 'WORKING' | 'ERROR',
    },
    modal: false | 'signin' | 'createUser',
    signinForm: {
      submitButton: 'AVAILABLE' | 'WORKING' | 'ERROR',
      error: null | String
    },
    signinForm: {
      submitButton: 'AVAILABLE' | 'WORKING' | 'ERROR',
      error: null | String
    }
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
      signinForm: {
        submitButton: 'AVAILABLE',
        error: ''
      },
      createUserError: {
        submitButton: 'AVAILABLE',
        error: ''
      }
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
