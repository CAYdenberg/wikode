const React = require('react');

const Header = require('../layout/Header');
const Footer = require('../layout/Footer');

const WikiEditor = require('./WikiEditor');

module.exports = (props) => {
  return (
    <div>
      <Header />

      <div className="column row">
        <h1>Document Title</h1>
        <WikiEditor content={props.content} save={props.save} />
      </div>

      <Footer />
    </div>
  );
}
