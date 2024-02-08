// models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: String,
  authorName: String,
  category: String,
  image: String,
  pdf: String,
  description: String,
});

module.exports = mongoose.model('Book', bookSchema);
