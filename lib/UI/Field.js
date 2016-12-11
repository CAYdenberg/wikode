const React = require('react');

const Field = props => {

  return (
    <div>
      <label>
        {props.label}
        <input
          type={props.type || 'text'}
          name={props.name}
          id={props.name}
          value={props.value}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
        />
      </label>
      <span className="field-message">{props.validationMessage}</span>
    </div>
  );
}

Field.propTypes = {
  type: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,

  value: React.PropTypes.string,
  handleChange: React.PropTypes.func,

  validationMessage: React.PropTypes.string,
  handleBlur: React.PropTypes.func
}

module.exports = Field;
