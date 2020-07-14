const express = require('express');
const router = express.Router()
const Location = require('../models/location.models')
var multer = require('multer');
const path = require('path')
const uploadPath = path.join('public', 'locationimg')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath);
     },
    filename: function (req, file, cb) {
        cb(null , file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});

var upload = multer({ storage: storage});

router.post('/add', upload.single('profile'), (req, res) => {
  const location = new Location({
    address: req.body.address,
    image: req.file
  })

  const newLocation = location.save()
  res.json('Location added')
})

module.exports = router