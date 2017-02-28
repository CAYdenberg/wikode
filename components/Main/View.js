const React = require('react');

const Editor = require('./Editor');
const Static = require('./Static');

module.exports = (props) => {
  const content = props.editMode ? <Editor /> : <Static />

  return (

      <div className="column row">
        <h1>{props.title}</h1>
        {content}
      </div>

  );
}
