const User = require('./user.models');
const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  address_pri: {
    type: String,
    require: true
  },
  address_sec: {
    type: String,
    require: true
  },
  description: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  },
  imageURL: {
    type: []
  },
  coor: {
    type: []
  },
  watched: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'queue'
  },
  userID: {
    type: String
  },
  comments: {
    type: Array,
    timestamps: true,
    default: []
  },
  like: {
    type: Array
  }
}, {
  timestamps: true,
});

topicSchema.pre('save', async function(next) {
  var topic = this
  const user = await User.findById(topic.userID)
  if(user.role=="admin") {
    topic.status = "published"
    next()
  } else {
    next()
  }
})


module.exports = mongoose.model('Topic', topicSchema);