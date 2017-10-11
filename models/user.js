const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {type: String, unique: true, lowercase: true},
  password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
