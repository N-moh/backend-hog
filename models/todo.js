const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  name: String,
  description: String,
  completed: Boolean
})

module.exports.Todo = mongoose.model('todo', todoSchema,'todo')