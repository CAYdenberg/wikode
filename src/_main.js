const React = require('react');
const ReactDOM = require('react-dom');

const getStore = require('../store');

const store = getStore(window.state);

const {hideModals} = require('../store/actions');

if (!window.state.wikode || window.state.wikode.user === "local") {
  // dispatch get local wikode to store
}

const view = document.getElementById('mount-point').getAttribute('data-view');

window.triggerLocalNavigation = function(view, title, url) {
  store.dispatch(hideModals());
  const component = require('../components')(view, store);
  ReactDOM.render(component, document.getElementById('mount-point'));
  history.pushState({}, title, url);
}

window.triggerLocalNavigation(view);

window.store = store;
