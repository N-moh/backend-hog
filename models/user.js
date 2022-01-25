const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  token: String,
  role:String,
  profileForm:[{type: Schema.Types.ObjectId,ref:"ProfileForm"}]
},

{
  timestamps: true  
})

module.exports.User = mongoose.model('User', userSchema)