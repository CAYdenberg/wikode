const React = require('react');
const ReactDOM = require('react-dom');

const store = require('../store')(window.state);

const view = document.getElementById('mount-point').getAttribute('data-view');

/**
** Special method to set the view
*/
window.changeView = function(view) {
  const component = require('../components')(view, store);
  ReactDOM.render(component, document.getElementById('mount-point'));
}

window.changeView(view);

window.store = store;
