const {createStore, applyMiddleware} = require('redux');

const thunk = require('redux-thunk').default;

const reducer = require('./reducer');
const actions = require('./actions');

module.exports = exports.default = (initialState) => {
  const store = createStore(reducer, initialState, applyMiddleware(thunk));

  // shortcut for store.dispatch(actions.name(args))
  store.action = function(name, ...args) {
    const action = actions[name].apply(actions, args);
    this.dispatch(action);
    return action;
  }

  return store;
}
