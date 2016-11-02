const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(2);

const slugify = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

var nameValidation = {
  validator: function(name) {

    // disallow certain values
    const notAllowed = ['local', 'user'];
    if (notAllowed.indexOf(name) !== -1) {
      return false;
    }
    return true;

  },

  message: '{VALUE} is not allowed as a user name'
}


var UserSchema = new Schema({
  hash: {type: String},
  name: {type: String, required: true, validate: nameValidation}, // should be unique
  email: {type: String}, // should be email
  password: {type: String, required: true, set: (password) => bcrypt.hashSync(password, salt)}
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.plugin(slugify('name', {field: 'hash'}));

module.exports = mongoose.model('User', UserSchema);
