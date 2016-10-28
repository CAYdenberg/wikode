const React = require('react');
const ReactDOM = require('react-dom');

const redux = require('redux')
const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;

const thunk = require('redux-thunk').default;

const reducer = require('../store/reducer');
const store = createStore(reducer, window.state, applyMiddleware(thunk));

const mountPoint = document.getElementById('mount-point');

const component = require('../components')(mountPoint.getAttribute('data-view'), store);

ReactDOM.render(component, mountPoint);
