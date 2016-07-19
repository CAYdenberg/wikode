const React = require('react');
const ReactDOM = require('react-dom');

const redux = require('redux')
const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;

const thunk = require('redux-thunk').default;

const reducer = require('../store/reducer');
const store = createStore(reducer, window.state, applyMiddleware(thunk));

const template = document.getElementById('mount-point').getAttribute('data-template');

const component = require('../components')(template, store);

ReactDOM.render(component, document.getElementById('mount-point'));
