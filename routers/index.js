const express = require("express");
const router = express.Router();
const SlideImage = require("../models/slideimg.model");
const fs = require("fs");
const upload = require("../config/modelMulter");
const self = require("../config/multerconfig");
const cloudinary = require("cloudinary").v2.api;

router.get("/slideimg", (req, res) => {
  const img = SlideImage.find({}, (e, result) => {
    if (result.length === 0) {
      return res.json({ success: true, length: 0 });
    }
    return res.json({ success: true, length: result.length, result });
  });
});

const removeImageOnCloud = (Public_Ids) => {
  cloudinary.delete_resources(Public_Ids, (error, result) => {
    console.log(result);
  });
};

router.post(
  "/slideimg",
  upload.array("slide-img"),
  self.uploadMultipleFiles,
  async (req, res) => {
    try {
      const img = await SlideImage.findOne({}, (e, result) => {
        if (result) {
          removeImageOnCloud(
            result.img.map((img) => {
              return img.id;
            })
          );
        }
      });

      await SlideImage.deleteMany({}).catch(err => console.log(console.err))
      
      const SlideImg = new SlideImage({
        img: req.imageArray,
      });
      const newSlideImg = await SlideImg.save();
      res.json({ status: true, message: "Đã cập nhật background" });
    } catch (error) {
      console.log(error)
      res.json({ status: false, error });
    }
  }
);

module.exports = router;
