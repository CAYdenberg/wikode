const update = require('react-addons-update');
const {
  SAVE_WIKODE
} = require('./constants');


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
    wikode: {$merge: wikode(state.wikode, action)}
  });

}
