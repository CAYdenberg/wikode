const React = require('react');

module.exports = (props) => {
  const onToggle = function(e) {
    e.preventDefault();
    props.onToggle(props.style);
  }

  const label = (props.icon) ?
    (<span className={'icon-' + props.icon}></span>) :
    (props.label);

  return (
    <button className="editor-controls__button" onMouseDown={onToggle} aria-pressed={props.active} aria-label={props.label}>
      {label}
    </button>
  );
};
