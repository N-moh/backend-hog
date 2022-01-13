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
    default: "https://i.imgur.com/WiuO4Qg.png",
  },
  cv: {
    type: String,
  },
  role: {
    type: String,
    default: "Participant",
  }
},
{
  timestamps: true
})

module.exports.ProfileForm = mongoose.model('ProfileForm', profileFormSchema)