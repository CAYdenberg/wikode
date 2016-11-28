const React = require('react');

const Field = props => {

  const getValue = function() {
    return (props.formData[props.name]) || '';
  };

  return (
    <div>
      <label>
        {props.label}
        <input
          type={props.type || 'text'}
          name={props.name}
          id={props.name}
          value={getValue()}
          onChange={props.handleChange}
        />
      </label>
      <span className="field-message">{props.message}</span>
    </div>
  );
}

Field.propTypes = {
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  formData: React.PropTypes.object.isRequired,
  handleChange: React.PropTypes.func.isRequired
}

module.exports = Field;
