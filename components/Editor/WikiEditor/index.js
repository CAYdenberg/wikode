"use strict";

const React = require('react');

const Draft = require('draft-js');
const {Editor, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil} = Draft;
const {hasCommandModifier} = KeyBindingUtil;

const actions = require('../../../actions/wikode');

const Controls = require('./Controls');

const WikiEditor = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {

    const state = this.context.store.getState();

    var editorState;
    try {
      editorState = EditorState.createWithContent(Draft.convertFromRaw(state.wikode.content));
    } catch(e) {
      editorState = EditorState.createEmpty();
    }

    return ({
      editorState: editorState,
      editMode: (state.wikode.user === state.user.hash) || (state.wikode.user === 'local')
    });
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
    const contentState = this.state.editorState.getCurrentContent();
    const content = Draft.convertToRaw(contentState);
    // we're going to send a PUT request to the current URL.
    // make sure we are browser side or we'll crash the server.
    try {
      const location = window ? window.location.href : null;
      this.context.store.dispatch(actions.save(location, content));
    } catch(e) {
      throw new Error('Attempting to access current page URL on server');
    }
  },

  _fork: function() {
    const user = this.context.store.getState().user;
    const hash = user ? user.hash : null;
    this.context.store.dispatch(actions.fork(hash));
    this.setState({
      editMode: true
    });
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

    return this.state.editMode ? (
      <div className="RichEditor-root">
        <Controls
          editorState={this.state.editorState}
          toggleInlineStyle={this.toggleInlineStyle}
          toggleBlockType={this.toggleBlockType}
          save={this._save}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            keyBindingFn={getKeyBinding}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder=""
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    ) : (
      <div className="RichEditor-root">
        <div className={className}>
          <Editor contenteditable="false"
            readOnly="true"
            editorState={editorState}
            placeholder=""
            ref="editor"
            spellCheck={false}
          />
        </div>
        <button onClick={this._fork}>Fork this document</button>
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

function getKeyBinding(e) {
  if (e.keyCode === 83 && hasCommandModifier(e)) { // ctrl + S
    return 'save';
  }
  return getDefaultKeyBinding(e);
}

module.exports = WikiEditor;
