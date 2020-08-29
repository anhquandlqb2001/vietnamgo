const UserModel = require("../models/user.models");

class UserController {
  user_list_get(req, res) {
    UserModel.find({}, (e, result) => {
      res.json(result);
    });
  }

  async user_role_up_put(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      user.role = "creator";
      await user.save();
      return res.json({ success: true });
    } catch (err) {}
  }

  async user_role_down_put(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      user.role = "customer";
      await user.save();
      return res.json({ success: true });
    } catch (error) {}
  }
}

module.exports = new UserController();
