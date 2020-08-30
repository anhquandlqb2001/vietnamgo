const cloudinary = require("../config/cloudConfig");
const self = (module.exports = {
  uploadSingleLocationImage: async (req, res, next) => {
    cloudinary.uploadLocationImage(req.file.path).then((result) => {
      console.log(result);
      let imageDetails = {
        imageName: req.file.originalname || "",
        url: result.url,
        main: result.main,
        id: result.id,
      };
      req.imageDetails = imageDetails;
      next();
    });
  },
  uploadSingleTopicThumb: async (req, res, next) => {
    if (!req.files || !req.files.imgThumb) {
      return next()
    }
    cloudinary.uploadTopicThumb(req.files.imgThumb[0].path).then((result) => {
      let imageDetails = {
        imageName: req.files.imgThumb[0].originalname || "",
        url: result.url,
        main: result.main,
        id: result.id,
      };
      req.imageDetails = imageDetails;
      next();
    });
  },

  uploadTopicImage: async (req, res, next) => {
    if (!req.files || !req.files.imgUpload) {
      return next()
    }
    let res_promises = req.files.imgUpload.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploadTopicImages(file.path).then((result) => {
            resolve(result);
          });
        })
    );

    Promise.all(res_promises)
      .then(async (arrImg) => {
        req.imageArray = arrImg;
        next();
      })
      .catch((error) => {
        console.error("> Error>", error);
      });
  },

  uploadMultipleBackgroundImages: async (req, res, next) => {
    let res_promises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploadBackgroundImages(file.path).then((result) => {
            resolve(result);
          });
        })
    );
    Promise.all(res_promises)
      .then(async (arrImg) => {
        req.imageArray = arrImg;
        next();
      })
      .catch((error) => {
        console.error("> Error>", error);
      });
  },
});
