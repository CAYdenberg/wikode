const React = require('react');
const Draft = require('draft-js');
const {EditorState, CompositeDecorator, convertFromRaw, convertToRaw} = Draft;

const decorator = new CompositeDecorator([{
  strategy: (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  },
  component: (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
      <a href={url}>
        {props.children}
      </a>
    );
  }
}]);

module.exports = {
  raw2EditorState: (raw) => {
    var editorState;
    try {
      editorState = EditorState.createWithContent(convertFromRaw(raw), decorator);
    } catch(e) {
      editorState = EditorState.createEmpty(decorator);
    }
    return editorState;
  },

  editorState2Raw: (editorState) => {
    const contentState = editorState.getCurrentContent();
    return convertToRaw(contentState);
  }
}
