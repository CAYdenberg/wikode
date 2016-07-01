const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  hash: String,
  name: {type: String, unique: true}, // should be unique
  email: String, // should be email
  password: {type: String, set: bcrypt.hashSync}
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
