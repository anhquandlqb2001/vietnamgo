const jwt = require('jsonwebtoken')

const auth_token = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ success: false, message: "no token" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json(err);
    req.user = user;
    next();
  });
};

module.exports = auth_token;
