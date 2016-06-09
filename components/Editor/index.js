const React = require('react');
const WikiEditor = require('./WikiEditor');

module.exports = (props) => {
  return (
    <div>
      <h1>Editor Page</h1>

      <WikiEditor content={props.content} save={props.save} />
    </div>
  );
}
