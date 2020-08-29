const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).json({ success: false });
  }
  next();
};

const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).json({ success: false });
  }
  next();
};

module.exports = { checkAuthenticated, checkNotAuthenticated };
