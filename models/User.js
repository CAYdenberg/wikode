const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(2);

const slugify = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  hash: {type: String, unique: true},
  name: {type: String, required: true}, // should be unique
  email: {type: String}, // should be email
  password: {type: String, required: true, set: (password) => bcrypt.hashSync(password, salt)}
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.plugin(slugify('name', {field: 'hash'}));

module.exports = mongoose.model('User', UserSchema);
