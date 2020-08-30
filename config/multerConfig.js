const multer = require("multer")
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    // console.log(file)
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
const upload = multer({ storage: storage })

module.exports = upload