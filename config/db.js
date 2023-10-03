
const mongoose = require('mongoose');
const uri = "mongodb+srv://ashikulakash4537:DrMPMLRH81zGT5lj@cluster0.rxlpake.mongodb.net/school_finder"; 

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
