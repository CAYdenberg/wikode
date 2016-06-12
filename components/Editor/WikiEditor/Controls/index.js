const React = require('react');

const BlockStyleControls = require('./BlockStyleControls');
const InlineStyleControls = require('./InlineStyleControls');

module.exports = (props) => {
  return (

    <div>
      <BlockStyleControls
        editorState={props.editorState}
        onToggle={props.toggleBlockType}
      />
      <InlineStyleControls
        editorState={props.editorState}
        onToggle={props.toggleInlineStyle}
      />
      <button save={props.save}>Save</button>
    </div>

  );
}
