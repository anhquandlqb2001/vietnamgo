const SlideImageModel = require("../models/slideimg.model")
const cloudinary = require('cloudinary').v2.api

class SiteController {
  site_slideImage_get(req, res) {
    const img = SlideImageModel.find({}, (e, result) => {
      if (result.length === 0) {
        return res.json({ success: true, length: 0 });
      }
      return res.json({ success: true, length: result.length, result });
    });
  }
  async site_slideImage_post(req, res) {
    try {
      const img = await SlideImageModel.findOne({}, (e, result) => {
        if (result) {
          removeImageOnCloud(
            result.img.map((img) => {
              return img.id;
            })
          );
        }
      });

      await SlideImageModel.deleteMany({}).catch((err) => console.log(console.err));

      const SlideImg = new SlideImageModel({
        img: req.imageArray,
      });
      const newSlideImg = await SlideImg.save();
      res.json({ status: true, message: "Đã cập nhật background" });
    } catch (error) {
      console.log(error);
      res.json({ status: false, error });
    }
  }
}

const removeImageOnCloud = (Public_Ids) => {
  cloudinary.delete_resources(Public_Ids, (error, result) => {
    console.log(result);
  });
};

module.exports = new SiteController;
