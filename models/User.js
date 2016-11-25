const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(2);

const Schema = mongoose.Schema;


var UserSchema = new Schema({
  hash: {type: String, unique: true},
  email: {type: String, unique: true}, // should be email
  password: {type: String, required: true, set: (password) => bcrypt.hashSync(password, salt)}
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
