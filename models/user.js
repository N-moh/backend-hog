const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: String,
  password: String,
  token: String
},
{
  timestamps: true  
})

module.exports.User = mongoose.model('User', userSchema)