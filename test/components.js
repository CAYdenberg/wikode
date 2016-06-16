/* eslint-env mocha, node */

require('node-jsx').install();

const React = require('react');
const ReactRender = require('react-dom/server').renderToString;
const jsdom = require('jsdom');

const Home = require('../components/Home');

function analyze(component, props) {
  return new Promise(function(resolve, reject) {

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
    analyze(Home, props).then(function(document) {
      done();
    });
  });


});
