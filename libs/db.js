const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const MONGO_URL = 'mongodb://localhost/authPassport';

mongoose.connect(MONGO_URL, {useMongoClient: true});

mongoose.connection
  .once('open', () => console.log('Connected to the database!'))
  .on('error', err => console.log('Error: ', err));

module.exports = {MONGO_URL};
