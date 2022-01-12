const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  token: String
},
{
  timestamps: true  
})

module.exports.User = mongoose.model('User', userSchema)