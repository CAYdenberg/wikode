const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var WikodeSchema = new Schema({
  user: String,
  slug: String,
  datetime: String,
  content: {
    entityMap: Object,
    blocks: Array
  }
}, {
  minimize: false
});

module.exports = mongoose.model('Wikode', WikodeSchema);
