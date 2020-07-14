const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  totalWatch: {
    type: Number,
    default: 0
  },
  totalLike: {
    type: Number,
    default: 0
  },
  image: {
    type: [],
    require: true
  }
})

module.exports = mongoose.model('Location', locationSchema);