const React = require('react');

const BlockStyleControls = require('./BlockStyleControls');
const InlineStyleControls = require('./InlineStyleControls');

module.exports = (props) => {
  return (

    <div className="editor-controls">
      <BlockStyleControls
        editorState={props.editorState}
        onToggle={props.toggleBlockType}
      />
      <InlineStyleControls
        editorState={props.editorState}
        onToggle={props.toggleInlineStyle}
      />
      <button save={props.save} className="editor-controls__save" aria-label="save">
        <span className="icon-save-cloud"></span>
      </button>
    </div>

  );
}
