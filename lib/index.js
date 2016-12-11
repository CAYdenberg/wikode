const slug = require('slug');

module.exports = {

  slugify: function(input) {
    return slug(input).toLowerCase();
  },

  createFieldControl: function(form, key, initialValue) {

    const _setState = value => {
      let updateObj = {};
      updateObj[key] = value;
      form.setState(updateObj);
    }

    _setState(initialValue);

    return {
      value: initialValue,
      handleChange: e => _setState(e.target.value)
    }
  }
}
