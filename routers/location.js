const express = require('express');
const router = express.Router()
const Location = require('../models/location.models')

const upload = require("../config/modelMulter");
const self = require("../config/multerconfig");

router.post('/add', upload.single('profile'), self.uploadSingleFile, async (req, res) => {
  const newLocation = new Location({
    address: req.body.address,
    image: req.imageDetails
  })
  await newLocation.save()

  res.json({success: true})
})

router.get('/', (req, res) => {
  const location = Location.find({}, (e, result) => {
    res.json(result)
  })
})


router.get("/favourite", async (req, res) => {
  let out;
  const location = await Location.find({})
    .sort({ totalWatch: -1 })
    .limit(4)
    .exec((e, result) => {
      res.json(result);
    });
});

module.exports = router