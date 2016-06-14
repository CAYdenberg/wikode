const React = require('react');
const ReactDOM = require('react-dom');
const createStore = require('redux').createStore;

const reducer = require('../store/reducer');
const save = require('./save');

const store = createStore(reducer, window.state);

const template = document.getElementById('mount-point').getAttribute('data-template');

const component = require('../components')(template, store);

ReactDOM.render(component, document.getElementById('mount-point'));

/**
 * 
   _save: function() {
     const contentState = this.state.editorState.getCurrentContent();
     const content = Draft.convertToRaw(contentState);
     this.props.save(globals.user, globals.slug, content);
   },
 */
