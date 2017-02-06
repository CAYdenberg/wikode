const mongoose = require('mongoose');
const mongooseHistory = require('mongoose-history');

const Schema = mongoose.Schema;

var WikodeSchema = new Schema({
  user: String,
  title: String,
  slug: String,
  datetime: String,
  content: {
    entityMap: Object,
    blocks: Array
  }
}, {
  minimize: false
});

WikodeSchema.plugin(mongooseHistory, {metadata: [
  {key: 'original', value: (original) => original}
]});

module.exports = mongoose.model('Wikode', WikodeSchema);
