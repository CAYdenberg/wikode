const React = require('react');
const StyleButton = require('./StyleButton');

const BLOCK_TYPES = [
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote', icon: 'quote'},
  {label: 'UL', style: 'unordered-list-item', icon: 'list-ul'},
  {label: 'OL', style: 'ordered-list-item', icon: 'list-ol'}
];

module.exports = (props) => {
  const editorState = props.editorState;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
