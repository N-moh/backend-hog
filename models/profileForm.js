const mongoose = require('mongoose');

const profileFormSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
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
  hired: {
    type: Boolean,
  },
  course: {
    type: String,
  },
  date: {
    type: Date,
  },
  admincomments: {
    type: String,
  },
},
{
  timestamps: true
})

module.exports.ProfileForm = mongoose.model('ProfileForm', profileFormSchema)