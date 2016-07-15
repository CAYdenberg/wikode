const React = require('react');

const HiddenField = (props) => {

  const getValue = function() {
    return (props.formData[props.name]) || '';
  };

  return (
    <input
      type="hidden"
      name={props.name}
      id={props.name}
      value={getValue()}
    />
  );
}

HiddenField.propTypes = {
  name: React.PropTypes.string.isRequired,
  formData: React.PropTypes.object.isRequired
}

module.exports = HiddenField;
