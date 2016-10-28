const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  hash: String,
  name: {type: String, sparse: true, unique: true} // should be unique
});


module.exports = mongoose.model('User', UserSchema);
