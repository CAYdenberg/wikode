const slug = require('slug');

module.exports = {
  slugify: function(input) {
    return slug(input).toLowerCase();
  }
}
