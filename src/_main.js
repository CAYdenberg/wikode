const React = require('react');
const ReactDOM = require('react-dom');

const getStore = require('../store');

const store = getStore(window.state);

const view = document.getElementById('mount-point').getAttribute('data-view');

const component = require('../components')(view, store);

ReactDOM.render(component, document.getElementById('mount-point'));
