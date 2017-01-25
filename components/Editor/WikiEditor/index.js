"use strict";

const React = require('react');

const Draft = require('draft-js');
const {Editor, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator, Entity, Modifier} = Draft;
const {hasCommandModifier} = KeyBindingUtil;

const actions = require('../../../store/actions');

const Controls = require('./Controls');
const Modal = require('../../partials/Modal');
const LoginForm = require('../../Login');

const WikiEditor = React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {

    const state = this.context.store.getState();

    const decorator = new CompositeDecorator([{
      strategy: findLinkEntities,
      component: Link
    }]);

    var editorState;
    try {
      editorState = EditorState.createWithContent(Draft.convertFromRaw(state.wikode.content), decorator);
    } catch(e) {
      editorState = EditorState.createEmpty(decorator);
    }

    return ({
      editorState: editorState,
      showURLInput: false,
      urlValue: '',
      editMode: (state.wikode.user === state.user),
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

  onURLChange: function(e) {
    this.setState({urlValue: e.target.value})
  },

  hideURLInput: function() {
    this.setState({showURLInput: false});
  },

  promptForLink: function(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url
      });
    }
  },

  confirmLink: function(e) {
    e.preventDefault();

    const {editorState, urlValue} = this.state;
    const contentState = editorState.getCurrentContent();
    const entityKey = Entity.create(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    const contentStateWithEntity = Modifier.applyEntity(contentState, editorState.getSelection(), entityKey);

    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
      showURLInput: false,
      urlValue: ''
    });
  },

  removeLink: function(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null)
      });
    }
  },

  _save: function() {
    const store = this.context.store;
    const contentState = this.state.editorState.getCurrentContent();
    const content = Draft.convertToRaw(contentState);
    const user = store.getState().user;
    this.context.store.dispatch(actions.save(store.getState().wikode, content, user));
  },

  _toggleLoginModal: function() {
    this.setState({
      loginModal: !this.state.loginModal
    });
  },

  _fork: function() {
    const user = this.context.store.getState().user;
    if (!user) {
      this._toggleLoginModal();
    } else {
      this._save();
    }
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
          urlValue={this.state.urlValue}
          showURLInput={this.state.showURLInput}
          toggleInlineStyle={this.toggleInlineStyle}
          toggleBlockType={this.toggleBlockType}
          onURLChange={this.onURLChange}
          promptForLink={this.promptForLink}
          hideURLInput={this.hideURLInput}
          confirmLink={this.confirmLink}
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

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = Entity.get(props.entityKey).getData();
  return (
    <a href={url}>
      {props.children}
    </a>
  );
};

module.exports = WikiEditor;
