require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const self = (module.exports = {
  uploadLocationImage: (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(file, {
          folder: "locations",
        })
        .then((result) => {
          resolve({
            url: result.secure_url,
            id: result.public_id,
            main: self.reSizeImage(result.public_id, 380, 280),
          });
        });
    });
  },
  uploadTopicThumb: (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(file, {
          folder: "thumb",
        })
        .then((result) => {
          resolve({
            url: result.secure_url,
            id: result.public_id,
            main: self.reSizeImage(result.public_id, 800, 1900),
          });
        });
    });
  },
  uploadTopicImages: (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(file, {
          folder: "topics",
        })
        .then((result) => {
          if (result) {
            resolve({
              url: result.secure_url,
              id: result.public_id,
              main: self.reSizeImage(result.public_id, 500, 500),
              dashboard: self.reSizeImage(result.public_id, 300, 350)
            });
          }
        });
    });
  },

  uploadBackgroundImages: (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(file, {
          folder: "backgrounds",
        })
        .then((result) => {
          if (result) {
            resolve({
              url: result.secure_url,
              id: result.public_id,
              main: self.reSizeImage(result.public_id, 720, 1600),
            });
          }
        });
    });
  },
  reSizeImage: (id, h, w) => {
    return cloudinary.url(id, {
      height: h,
      width: w,
      crop: "scale",
      format: "jpg",
    });
  },
});
