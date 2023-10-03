
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
  DIVISION_NAME: String,
  DISTRICT_NAME: String,
  THANA_NAME: String,
  TYP: String,
  LVL: String,
  EIIN: Number,
  INSTITUTE_NAME_NEW: String,
  POST_OFFICE: String,
  LOCATION: String,
  MOBPHONE: String,
});

module.exports = mongoose.model('School', schoolSchema);
