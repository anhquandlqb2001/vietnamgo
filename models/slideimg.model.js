const mongoose = require('mongoose')

const slideImgSchema = mongoose.Schema({
  img: {
    type: []
  }
})

module.exports = mongoose.model('SlideImage', slideImgSchema)