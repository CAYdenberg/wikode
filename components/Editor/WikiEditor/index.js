"use strict";

const React = require('react');

const Draft = require('draft-js');
const {Editor, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil} = Draft;
const {hasCommandModifier} = KeyBindingUtil;

const Controls = require('./Controls');
const Modal = require('../../partials/Modal');
const Affix = require('../../partials/Affix');
const LoginForm = require('../../Login');

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
      editMode: (state.wikode.user === state.user),
      showURLInput: false,
      urlValue: '',
      loginModal: false
    });
  },

  componentWillMount: function() {
    const store = this.context.store;
    this.context.store.subscribe(() => {
      const state = store.getState();
      this.setState({
        editMode: (state.wikode.user === state.user)
      });
    });
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
    const contentState = this.state.editorState.getCurrentContent();
    const content = Draft.convertToRaw(contentState);
    const user = store.getState().user;
    store.action("save", store.getState().wikode, content, user);
  },

  _toggleLoginModal: function() {
    this.setState({
      loginModal: !this.state.loginModal
    });
  },

  _fork: function(e) {
    const user = this.context.store.getState().user;
    if (!user) {
      e.preventDefault();
      this._toggleLoginModal();
      return false;
    }
    return true;
  },

  render: function() {
    const editorState = this.state.editorState;
    const wikode = this.context.store.getState().wikode;
    const thisUrl = `/wikode/${wikode.user}/${wikode.slug}/`;

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
        <Affix>
          <Controls
            editorState={this.state.editorState}
            urlValue={this.state.urlValue}
            showURLInput={this.state.showURLInput}
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
    ) : (
      <div className="RichEditor-root">
        <Affix>
          <div className="editor-controls">
            <form method="POST" action={thisUrl} onSubmit={this._fork}>
              <button type="submit" className="editor-controls__save" aria-label="fork">
                Fork this document
              </button>
            </form>
          </div>
        </Affix>
        <div className={className}>
          <Editor contenteditable="false"
            readOnly="true"
            editorState={editorState}
            placeholder=""
            ref="editor"
            spellCheck={false}
          />
        </div>

        <Modal title="Login to continue" hide={this._toggleLoginModal} visible={this.state.loginModal}>
          <LoginForm />
        </Modal>

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
