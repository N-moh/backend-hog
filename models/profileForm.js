const mongoose = require('mongoose');

const profileFormSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  picture: {
    type: String,
    default: "https://i.imgur.com/2idphdd.png",
  },
  cv: {
    type: String,
  },
  role: {
    type: String,
    default: "Participant",
  },
  hired: {
    type: Boolean,
  },
},
{
  timestamps: true
})

module.exports.ProfileForm = mongoose.model('ProfileForm', profileFormSchema)