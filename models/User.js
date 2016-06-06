const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  hash: String,
  name: String,
  email: String,
  password: String
});

module.exports = mongoose.model('User', UserSchema);
