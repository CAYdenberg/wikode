const React = require('react');

const Draft = require('draft-js');
const Editor = Draft.Editor;
const EditorState = Draft.EditorState;
const RichUtils = Draft.RichUtils;

const BlockStyleControls = require('./BlockStyleControls');
const InlineStyleControls = require('./InlineStyleControls');

const WikiEditor = React.createClass({
  getInitialState: function() {

    var editorState;
    try {
      editorState = EditorState.createWithContent(Draft.convertFromRaw(this.props.content));
    } catch(e) {
      editorState = EditorState.createEmpty();
    }

    return ({
      editorState: editorState
    });

  },

  onChange: function(editorState) {
    this.setState({editorState});
  },

  handleKeyCommand: function(command) {
    const editorState = this.state.editorState;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  },

  toggleBlockType: function(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  },

  toggleInlineStyle: function(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  },

  _save: function() {
    const contentState = this.state.editorState.getCurrentContent();
    const content = Draft.convertToRaw(contentState);
    console.log(content);
    this.props.save(globals.user, globals.slug, content);
  },

  render: function() {
    const editorState = this.state.editorState;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder=""
            ref="editor"
            spellCheck={true}
          />
        </div>
        <button onClick={this._save}>Save</button>
      </div>
    );
  }
});

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

module.exports = WikiEditor;
