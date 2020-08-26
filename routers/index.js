const express = require("express");
const router = express.Router();
const SlideImage = require("../models/slideimg.model");
const fs = require("fs");
const { db } = require("../models/user.models");
const upload = require("../config/modelMulter");
const self = require("../config/multerconfig");

router.get("/slideimg", (req, res) => {
  const img = SlideImage.find({}, (e, result) => {
    res.json(result);
  });
});


router.post(
  "/slideimg",
  upload.array("slide-img"),
  self.uploadMultipleFiles,
  async (req, res) => {
    const SlideImg = new SlideImage({
      img: req.imageArray,
    });
    const newSlideImg = await SlideImg.save();
    res.json({ status: true, message: "Đã cập nhật background" });
  }
);

module.exports = router;
