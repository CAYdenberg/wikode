const React = require('react');

const WikiEditor = require('./WikiEditor');

module.exports = (props) => {
  return (

      <div className="column row">
        <h1>Document Title</h1>
        <WikiEditor />
      </div>

  );
}
