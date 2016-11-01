const {createStore, applyMiddleware} = require('redux');

const thunk = require('redux-thunk').default;
const reducer = require('./reducer');

module.exports = (initialState) => {
  const store = createStore(reducer, initialState, applyMiddleware(thunk));
  return store;
}
