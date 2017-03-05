const React = require('react');

const Draft = require('draft-js');
const {Editor, RichUtils, getDefaultKeyBinding, KeyBindingUtil} = Draft;
const {hasCommandModifier} = KeyBindingUtil;

const converter = require('../../../lib/converter');
const Affix = require('../../partials/Affix');
const Controls = require('./Controls');


function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}


function getKeyBinding(e) {
  if (e.keyCode === 83 && hasCommandModifier(e)) { // ctrl + S
    return 'save';
  }
  return getDefaultKeyBinding(e);
}


const WikiEditor = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    const state = this.context.store.getState();
    const editorState = converter.raw2EditorState(state.wikode.content);
    return ({
      editorState: editorState
    });
  },

  componentWillMount: function() {
    return;
  },

  onEditorMount: function(domNode) {
    domNode.focus();
  },

  onChange: function(editorState) {
    this.setState({editorState: editorState});
  },

  handleKeyCommand: function(command) {
    if (command === 'save') {
      this._save();
      return true;
    }
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
    const store = this.context.store;
    const content = converter.editorState2Raw(this.state.editorState);
    store.action('save', store.getState().wikode, content);
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
        <Affix>
          <Controls
            editorState={this.state.editorState}
            toggleInlineStyle={this.toggleInlineStyle}
            toggleBlockType={this.toggleBlockType}
            save={this._save}
          />
        </Affix>
        <div className={className}>
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            keyBindingFn={getKeyBinding}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder=""
            ref={this.onEditorMount}
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
});

module.exports = WikiEditor;
