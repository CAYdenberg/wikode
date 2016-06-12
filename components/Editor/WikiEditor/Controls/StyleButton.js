const React = require('react');

module.exports = (props) => {
  const onToggle = function(e) {
    e.preventDefault();
    props.onToggle(props.style);
  }

  return (
    <span onMouseDown={onToggle}>
      {props.label}
    </span>
  );
};
