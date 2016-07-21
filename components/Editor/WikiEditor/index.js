"use strict";

const React = require('react');

const Draft = require('draft-js');
const Editor = Draft.Editor;
const EditorState = Draft.EditorState;
const RichUtils = Draft.RichUtils;

const actions = require('../../../store/actions');

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
      saveState: state.ui.save
    });

  },

  componentWillMount: function() {
    const store = this.context.store;
    store.subscribe(() => {
      this.setState({
        saveState: store.getState().ui.save
      });
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
    const appState = this.context.store.getState();
    const wikode = appState.wikode;
    const username = wikode.username || wikode.userHash;
    this.context.store.dispatch(actions.save(username, wikode.slug, content));
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
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder=""
            ref="editor"
            spellCheck={true}
          />
        </div>
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
