const express = require("express");
const router = express.Router();
const Location = require("../models/location.models");
const upload = require("../config/modelMulter");
const self = require("../config/multerconfig");

router.post(
  "/add",
  upload.single("profile"),
  async (req, res, next) => {
    try {
      const checkExistLocation = await Location.findOne({
        address: req.body.address,
      });
      if (!checkExistLocation) {
        return next();
      }
      return res.json({ success: false, message: "Dia diem da ton tai" });
    } catch (error) {
      return res.json({ success: false, error });
    }
  },
  self.uploadSingleFile,
  async (req, res) => {
    try {
      const newLocation = new Location({
        address: req.body.address,
        image: req.imageDetails,
      });
      await newLocation.save();
      return res.json({ success: true, message: "Them dia diem thanh cong" });
    } catch (error) {
      res.json({ success: false, error });
    }
  }
);

router.get("/", (req, res) => {
  Location.find({}, (e, result) => {
    res.json(result);
  });
});

router.get("/favourite", (req, res) => {
  Location.find({})
    .sort({ totalWatch: -1 })
    .limit(4)
    .exec((e, result) => {
      res.json(result);
    });
});

module.exports = router;
