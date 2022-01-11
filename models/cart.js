const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
})

module.exports.Cart = mongoose.model('Cart', adSchema)