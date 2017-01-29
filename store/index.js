const {createStore, applyMiddleware} = require('redux');

const thunk = require('redux-thunk').default;
const reducer = require('./reducer');
const popsicle = require('popsicle');
const update = require('react-addons-update');

const {
  SAVE_WIKODE,
  SET_MODAL
} = require('./constants');

function Actions(ajax) {
  this.ajax = ajax;

  /**
   *  SAVING A DOCUMENT
   */
  this.saveResponse = function(res) {
    const data = JSON.parse(res.body);
    switch(res.status) {

      case 200:
        return {type: SAVE_WIKODE, datetime: data.wikode.datetime, user: data.wikode.user};

      default:
        return {};

    }
  };

  this.save = function(wikode, content, user) {
    const newWikode = update(wikode, {$merge: {
      content: content,
      user: user
    }});

    return (dispatch) => {
      this.ajax.put({
        url: `/wikode/${newWikode.slug}`,
        body: newWikode,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then((res) => {
        history.pushState({}, newWikode.title, `/wikode/${newWikode.user}/${newWikode.slug}`);
        dispatch(this.saveResponse(res));
      });
    }
  };

  /**
   *  UI HANDLING
   */

  this.openModal = function(modal) {
    return {type: SET_MODAL, value: modal}
  };

  this.closeModals = function() {
    return {type: SET_MODAL, value: null}
  }
}

exports.Actions = Actions;

module.exports = exports.default = (initialState) => {
  const store = createStore(reducer, initialState, applyMiddleware(thunk));

  const actions = new Actions(popsicle);

  // shortcut for store.dispatch(actions.name(args))
  store.action = function(name, ...args) {
    const action = actions[name].apply(actions, args);
    this.dispatch(action);
    return action;
  }

  return store;
}
