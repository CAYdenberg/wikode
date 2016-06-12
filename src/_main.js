const React = require('react');
const ReactDOM = require('react-dom');

const templates = {
  Home: require('../components/Home'),
  Editor: require('../components/Editor')
};

const save = require('./save');

const content = globals.content || null;
const mountPoint = document.getElementById('mount-point');
const template = templates[mountPoint.getAttribute('data-template')];

ReactDOM.render(React.createElement(template, {
    content: content,
    save: save
  }),
  document.getElementById('mount-point')
);
