/* eslint-env mocha, node */

require('node-jsx').install();

const assert = require('assert');
const React = require('react');
const ReactRender = require('react-dom/server').renderToString;
const jsdom = require('jsdom');

const Home = require('../components/Home');
const Controls = require('../components/Editor/WikiEditor/Controls');
const Header = require('../components/layout/Header');
const Footer = require('../components/layout/Footer');
const Modal = require('../components/partials/Modal');

function analyze(component, props) {
  return new Promise((resolve, reject) => {

    const html = ReactRender(React.createElement(component, props));

    jsdom.env(html, function(err, window) {
      if (err) {
        reject(err);
        throw new Error(err);
      } else {
        resolve(window.document);
      }
    });

  });
}

describe('Home', function() {
  const props = {};

  it('displays the home page', function(done) {
    analyze(Home, props).then(() => {
      done();
    });
  });

});

describe('Header', function() {
  const props = {};

  it('displays a navigations bar with two buttons and a link to the homepage', function(done) {
    analyze(Header, props).then((document) => {
      const links = document.querySelectorAll('a');
      assert.equal(links.length, 3);
      assert.equal(links[0].href, '/');
      done();
    });
  });
});

describe('Footer', function() {
  const props = {};

  it('Displays the site footer as well as hidden elements such as modals', function(done) {
    analyze(Footer, props).then(() => {
      done();
    });
  });
})

describe('Modal', function() {
  it('displays a modal with a defined title and some inner text. An HR separates them', function(done) {

    const props = {
      title: 'My Modal',
      children: React.createElement('p')
    };
    analyze(Modal, props).then((document) => {
      assert.equal(document.querySelector('h2').innerHTML, 'My Modal');
      assert.equal(document.querySelectorAll('hr').length, 1);
      done();
    });

  });
})

describe.skip('Editor controls', function() {
  //we're either going to have to mock out the editorState or just pass the props
  //we need down to here

  const props = {};

  it('displays a box of controls', function(done) {
    analyze(Controls, props).then(() => {
      done();
    });
  });

})
