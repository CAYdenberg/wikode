const update = require('react-addons-update');
const {
  SAVE_WIKODE,
  SET_MODAL
} = require('./constants');


function ui(state, action) {
  switch (action.type) {

    case SET_MODAL:
      return update(state, {$merge: {
        modal: action.value
      }});

    default:
      return state;
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
      flash: []
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
