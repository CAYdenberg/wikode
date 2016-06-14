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
    save: 'AVAILABLE' | 'WORKING' | 'ERROR'
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
      save: 'AVAILABLE'
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
