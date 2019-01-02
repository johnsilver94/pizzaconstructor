const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema();

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
