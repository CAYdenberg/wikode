const React = require('react')
const ReactDOM = require('react-dom');

const draft = require('draft-js');
const Editor = draft.Editor;
const EditorState = draft.EditorState;


const WikEditor = React.createClass({
  getInitialState: function() {
    return ({
      editorState: EditorState.createEmpty()
    });
  },
  onChange: function(editorState) {
    this.setState({editorState});
  },
  render() {
    const editorState = this.state.editorState;
    return <Editor editorState={editorState} onChange={this.onChange} />;
  }
});

ReactDOM.render(
  <WikEditor />,
  document.getElementById('editor')
);
