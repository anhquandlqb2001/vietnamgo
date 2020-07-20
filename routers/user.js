const express = require("express");
const router = express.Router();
const User = require("../models/user.models");

router.get("/", async (req, res) => {
  const users = await User.find({}, (e, result) => {
    res.json(result);
  });
});

router.get("/up", async (req, res) => {
  const user = await User.findById(req.query.id);
  user.role = "creator";
  await user.save();
});

router.get("/down", async (req, res) => {
  const user = await User.findById(req.query.id);
  user.role = "customer";
  await user.save();
});

module.exports = router;