const React = require('react');
const ReactDOM = require('react-dom');

const getStore = require('../store');

const store = getStore(window.state);

const {hideModals} = require('../store/actions');

if (!window.state.wikode || window.state.wikode.user === "local") {
  // dispatch get local wikode to store
}

const view = document.getElementById('mount-point').getAttribute('data-view');

window.changeView = function(view) {
  store.dispatch(hideModals());
  const component = require('../components')(view, store);
  ReactDOM.render(component, document.getElementById('mount-point'));
}

store.subscribe(() => {
  const state = store.getState();
  if (state.wikode.user && state.wikode.slug && state.wikode.title) {
    history.pushState({}, state.wikode.title, '/' + state.wikode.user + '/' + state.wikode.slug);
  }
});

window.changeView(view);

window.store = store;
