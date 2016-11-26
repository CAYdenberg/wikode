const React = require('react');
const StyleButton = require('./StyleButton');

const BlockStyleControls = require('./BlockStyleControls');
const InlineStyleControls = require('./InlineStyleControls');



module.exports = (props) => {
  const urlInput =
    (
      <div className="reveal-overlay" aria-hidden={!props.showURLInput} onClick={props.hideURLInput}>
        <div className="reveal" aria-hidden={!props.showURLInput} onClick={e => e.stopPropagation()}>
          <input
            onChange={props.onURLChange}
            type="url"
            value={props.urlValue}
          />
          <button onMouseDown={props.confirmLink}>
            Confirm
          </button>
        </div>
      </div>
    );

  return (

    <div className="editor-controls">
      {urlInput}
      <BlockStyleControls
        editorState={props.editorState}
        onToggle={props.toggleBlockType}
      />
      <InlineStyleControls
        editorState={props.editorState}
        onToggle={props.toggleInlineStyle}
      />
      <StyleButton
        key="link"
        label="link"
        icon="link"
        onToggle={props.promptForLink}
        style={null}
      />
      <button onClick={props.save} className="editor-controls__save" aria-label="save">
        <span className="icon-save-cloud"></span>
      </button>
    </div>

  );
}
