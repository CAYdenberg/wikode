const React = require('react');
const ReactDOM = require('react-dom');





const store = createStore(reducer, window.state, applyMiddleware(thunk));

const template = document.getElementById('mount-point').getAttribute('data-template');

const component = require('../components')(template, store);

ReactDOM.render(component, document.getElementById('mount-point'));
