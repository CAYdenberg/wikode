const React = require('react');

module.exports = (props) => {
  const onToggle = function(e) {
    e.preventDefault();
    props.onToggle(props.style);
  }

  const icon = () => {
    if (props.icon) {
      return (<span className={'icon-' + props.icon}></span>)
    } else {
      return (props.label);
    }
  };

  return (
    <button className="editor-controls__button" onMouseDown={onToggle} aria-pressed={props.active} aria-label={props.label}>
      {icon}
    </button>
  );
};
