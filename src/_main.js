const React = require('react');
const ReactDOM = require('react-dom');

const getStore = require('../store');

const store = getStore(window.state);

const {hideModals} = require('../store/actions');

const view = document.getElementById('mount-point').getAttribute('data-view');

/**
** Special method to set the view
*/
window.changeView = function(view) {
  store.dispatch(hideModals());
  const component = require('../components')(view, store);
  ReactDOM.render(component, document.getElementById('mount-point'));
}

/**
* When the wikode in the application state changes, update the URL
*/
store.subscribe(() => {
  const state = store.getState();
  if (state.wikode.user && state.wikode.slug && state.wikode.title) {
    history.pushState({}, state.wikode.title, '/' + state.wikode.user + '/' + state.wikode.slug);
  }
});

window.changeView(view);

window.store = store;
