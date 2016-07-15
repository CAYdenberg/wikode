const React = require('react');

const TextField = (props) => {

  const getValue = function() {
    return (props.formData[props.name]) || '';
  };

  const handleBlur = function() {
    if (typeof props.check === 'function') {
      props.check(getValue());
    }
  };

  return (
    <div>
      <label>
        {props.label}
        <input
          type="text"
          name={props.name}
          id={props.name}
          value={getValue()}
          onChange={props.change}
          onBlur={handleBlur}
        />
      </label>
      <span className="field-message">{props.valid}</span>
    </div>
  );
}

TextField.propTypes = {
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  formData: React.PropTypes.object.isRequired,
  valid: React.PropTypes.string,
  change: React.PropTypes.func.isRequired,
  check: React.PropTypes.func
}

module.exports = TextField;
