const upload = require("../middleware/upload")
const Topic = require('../models/topic.models')
const fs = require('fs')
const path = require('path')
const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }
    const newTopic = new Topic({
      title: req.body.title,
      address_pri: req.body.address_pri,
      address_sec: req.body.address_sec,
      description: req.body.description,
      body: req.body.body,
      imageURL: req.files,
      coor: [req.body.coorx, req.body.coory],
      watched: req.body.watched,
      userID: req.body.id,
      comments: []
    })

    const topic = await newTopic.save()
    res.json('Topic added')

  } catch (error) {
    console.log(error);
    res.status(400).json('Error: ' + error)
  }
};

module.exports = {
  uploadFiles: uploadFiles
};