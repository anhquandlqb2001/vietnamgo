const UserModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require('jsonwebtoken')

class AuthController {
  auth_login_validate(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        info: {
          message: "Empty field",
        },
      });
    }
    next();
  }

  auth_login_verify(req, res, next) {
    return passport.authenticate(
      "local",
      { session: false },
      (err, user, info) => {
        if (err) {
          return res.json(err);
        }
        if (user) {
          const usr = {username: user.username, role: user.role, email: user.email, userID: user._id}
          const accessToken = generateAccessToken(usr)
          res.json({success: true, accessToken: accessToken, user: usr})
        }
      }
    )(req, res, next);
  }

  async auth_register_checkEmailExist(req, res, next) {
    try {
      let check = await UserModel.find({ email: req.body.email });
      if (check.length === 0) {
        next();
      } else {
        res.json("Email đã tồn tại");
      }
    } catch (error) {}
  }

  async auth_register_post(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = UserModel({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
      });

      const user = await newUser.save();
      res.json({ success: true });
    } catch (error) {}
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '12h'})
}

module.exports = new AuthController();
