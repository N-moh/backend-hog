const mongoose = require('mongoose');

const evtSchema = mongoose.Schema({
  name: String,
  place: String,
  description: String,
  date: Date,
  time: String,
  covidPass:Boolean


})

module.exports.Evt = mongoose.model('Evt', evtSchema)