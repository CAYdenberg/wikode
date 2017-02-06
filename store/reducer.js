const update = require('react-addons-update');
const {
  SAVE_WIKODE,
  SET_MODAL,
  SET_MESSAGE
} = require('./constants');


function getMessage(action) {
  switch (action.type) {
    case SET_MESSAGE:
      return action.message

    case SAVE_WIKODE:
      return 'The document was successfully saved';

    default:
      return null;
  }
}

function messages(state, action) {
  const message = getMessage(action);
  if (!message) {
    return state;
  }
  return update(state, {$push:
    [{message: message, timestamp: Date.now()}]
  });
}

function ui(state, action) {
  switch (action.type) {

    case SET_MODAL:
      return update(state, {$merge: {
        modal: action.value,
      }});

    default:
      return update(state, {$merge: {
        messages: messages(state.messages, action)
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
      messages: [] // {message: '', timestamp: 0}
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
