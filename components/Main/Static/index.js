const React = require('react');

const Draft = require('draft-js');
const {Editor, EditorState} = Draft;

const Affix = require('../../partials/Affix');

const Content = React.createClass({
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
      editorState: editorState
    });
  },

  _toggleLoginModal: function() {
    this.context.store.action('openModal', 'login');
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
    return (
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
        <div className='RichEditor-editor'>
          <Editor contenteditable="false"
            readOnly="true"
            editorState={editorState}
            placeholder=""
            ref="editor"
            spellCheck={false}
          />
        </div>
      </div>
    );
  }
});

module.exports = Content;
