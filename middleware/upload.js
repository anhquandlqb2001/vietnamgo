const util = require("util");
const multer = require("multer");
const path = require('path');
const uploadPath = path.join("public", "uploads");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadPath);
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});

var uploadFiles = multer({ storage: storage }).array("imgUpload", 10);

var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;