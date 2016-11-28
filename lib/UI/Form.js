const React = require('react');

const update = require('react-addons-update');

const Form = React.createClass({
  getInitialState: function() {
    return ({
      formData: {},
      validationData: {}
    });
  },

  onFieldChange: function(e) {
    var updateObj = {};
    updateObj[e.target.id] = e.target.value;
    this.setState({
      formData: update(this.state.formData, {$merge: updateObj})
    });
  },

  onFieldBlur: function(e) {

  },

  render: function() {
    const _this = this;
    return (
      <form>
        {React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, {
            handleChange: _this.onFieldChange,
            formData: _this.state.formData
          })
        })}
      </form>
    );
  }

});

module.exports = Form;
