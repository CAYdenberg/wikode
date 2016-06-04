const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var WikodeSchema = new Schema({
  user: String,
  slug: String,
  datetime: String,
  content: Array
});

module.exports = mongoose.model('Wikode', WikodeSchema);
