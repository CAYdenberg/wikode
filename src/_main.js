const React = require('react');
const ReactDOM = require('react-dom');

const save = require('./save');
const WikiEditor = require('../components/WikiEditor');
const Home = require('../components/Home');

const content = globals.content || null;
// ReactDOM.render(<WikiEditor content={content} save={save} />, document.getElementById('editor'));

ReactDOM.render(<Home />, document.getElementById('mount-point'));
