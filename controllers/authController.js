const UserModel = require("../models/user.models")
const bcrypt = require('bcrypt');

class AuthController {
  async auth_login_post(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    await UserModel.findOne({ email: email }, async (e, result) => {
      if (result == null) {
        res.json({ status: false, message: "Sai địa chỉ email" });
      } else {
        try {
          if (await bcrypt.compare(password, result.password)) {
            res.json({
              status: true,
              user: {
                username: result.username,
                role: result.role,
                id: result._id,
              },
              message: "Đăng nhập thành công",
            });
          } else {
            res.json({
              status: false,
              message: "Đăng nhập thất bại, sai mật khẩu",
            });
          }
        } catch (e) {}
      }
    });
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
      const userPackage = {
        username: user.username,
        role: user.role,
        id: user._id,
      };
      res.json({ userPackage, status: true });
    } catch (error) {}
  }
}

module.exports = new AuthController();
