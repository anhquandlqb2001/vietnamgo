const TopicModel = require('../models/topic.models')

const adminPermission = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403);
  }
  next();
};

const creatorPermission = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "creator") {
    return next();
  }
  res.status(403);
};

//edit, delete topic permission
const selfPermission = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next()
  }
  TopicModel.findById(req.params.id, (err, result) => {
    if (err) return res.status(404)
    if (result.userID === req.user.userID) {
      return next()
    }
    res.status(403)
  });
}

module.exports = { adminPermission, creatorPermission, selfPermission };
