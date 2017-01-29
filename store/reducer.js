const update = require('react-addons-update');
const {
  SAVE_WIKODE,
  SET_MODAL,
  SET_MESSAGE
} = require('./constants');


function message(state, action) {
  switch (action.type) {
    case SET_MESSAGE:
      return action.message

    case SAVE_WIKODE:
      return 'The document was successfully saved';

    default:
      return state;
  }
}

function ui(state, action) {
  switch (action.type) {

    case SET_MODAL:
      return update(state, {$merge: {
        modal: action.value,
      }});

    default:
      return update(state, {$merge: {
        message: message(state.message, action)
      }});
  }
}

function wikode(state, action) {
  switch(action.type) {

    case SAVE_WIKODE:
      return update(state, {$merge: {
        datetime: action.datetime,
        user: action.user
      }});

    default:
      return state;
  }
}

module.exports = function(initialState, action) {
  const state = Object.assign({
    ui: {
      modal: null,
      message: ''
    },
    user: null,
    wikode: {
      user: '',
      title: '',
      slug: '',
      content: {},
      lastSave: ''
    }
  }, initialState);

  return update(state, {
    ui: {$merge: ui(state.ui, action)},
    wikode: {$merge: wikode(state.wikode, action)}
  });

}
