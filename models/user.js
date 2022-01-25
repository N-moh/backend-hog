const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  token: String,
  role:String
},
{
  timestamps: true  
})

module.exports.User = mongoose.model('User', userSchema)