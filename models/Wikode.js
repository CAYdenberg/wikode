const mongoose = require('mongoose');
const mongooseHistory = require('mongoose-history');
const slug = require('slug');

const Schema = mongoose.Schema;

var WikodeSchema = new Schema({
  user: { type: String, required: true },
  title: { type: String, required: true },
  slug: String,
  datetime: String,
  content: {
    entityMap: Object,
    blocks: Array
  }
}, {
  minimize: false
});

// the combination of user and slug must be unique
WikodeSchema.index({ user: 1, slug: 1}, { unique: true });

WikodeSchema.pre('validate', function(next) {
  // create slug from title if not sent
  if (typeof this.slug === 'undefined') {
    this.slug = slug(this.title || '').toLowerCase();
  }
  // set datetime to current time
  this.datetime = new Date().toISOString();
  next();
});

WikodeSchema.plugin(mongooseHistory, {metadata: [
  {key: 'original', value: (original) => original}
]});

module.exports = mongoose.model('Wikode', WikodeSchema);
