const cloudinary = require("./cloudconfig");
const Topic = require("../models/topic.models");
const self = (module.exports = {
  uploadSingleFile: async (req, res, next) => {
    cloudinary.uploadSingle(req.file.path).then((result) => {
      console.log(result)
      let imageDetails = {
        imageName: req.file.originalname || "",
        url: result.url,
        id: result.id,
      };
      req.imageDetails = imageDetails
      next()
    });

  },
  uploadMultipleFiles: async (req, res, next) => {
    let res_promises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploadMultiple(file.path).then((result) => {
            resolve(result);
          });
        })
    );

    Promise.all(res_promises)
      .then(async (arrImg) => {
        req.imageArray = arrImg
        next()
      })
      .catch((error) => {
        console.error("> Error>", error);
      });
  },
});
