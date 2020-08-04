const express = require("express");
const router = express.Router();
const request = require("request");
const Topic = require("../models/topic.models");
const User = require("../models/user.models");
const Location = require("../models/location.models");
const SlideImage = require("../models/slideimg.model");
const multer = require("multer");
const { route } = require("./topics");
const path = require("path");
const uploadPath = path.join("public", "slideimg");
const fs = require("fs");
const { db } = require("../models/user.models");


// router.post('/search', (req, res) => {
//   let search = req.query.search
//   request(`https://api.unsplash.com/search/photos?client_id=a23535d66eec2d81f1d9aea445095e620bf47ec2df2b80266d2b7b92adf2d844&page=0&query=viet+nam+${search}`,
//     function(error, response, body) {
//       if (error) {
//         console.log(error)
//       } else {
//         let data = JSON.parse(body)
//         res.json(data)
//       }
//     })
// })

router.get("/slideimg", (req, res) => {
  // console.log('aaa')
  const img = SlideImage.find({}, (e, result) => {
    res.json(result);
  });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});

var upload = multer({ storage: storage });

router.post("/slideimg", upload.array("slide-img"), async (req, res) => {
  try {
    const list = await SlideImage.find({}, (e, result) => {
      result.map((el) => {
        el.img.forEach((element) => {
          // console.log(element.filename)
          fs.unlink(`public/slideimg/${element.filename}`, (e) => {
            if (e) {
              throw e;
            }
          });
          db.collection('slideimages').deleteOne({}, (err, obj) => {

          })
        });
      });
    });

  } catch (e) {
    console.log(e);
  }

  const SlideImg = new SlideImage({
    img: req.files,
  });
  const newSlideImg = await SlideImg.save();
  res.json({status: true, message: "Đã cập nhật background"});
});


module.exports = router;
