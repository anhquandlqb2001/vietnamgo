const upload = require("../middleware/upload")
const Topic = require('../models/topic.models')
const fs = require('fs')
const path = require('path')

const updateFiles = async (req, res) => {
  try {
    await upload(req, res);
    // if (req.files.length <= 0) {
    //   console.log('fail')
    //   return res.json(`You must select at least 1 file.`);
    // }

    let topic = await Topic.findById(req.params.id)
    topic.title = req.body.title
    topic.address_pri = req.body.address_pri
    topic.address_sec = req.body.address_sec
    topic.coor = [req.body.coorx, req.body.coory]
    topic.description = req.body.description
    topic.body = req.body.body

    await topic.save()
    console.log(topic)
    console.log("update ok")
    res.json('Topic updated !')

  } catch (error) {
    console.log(error);
    res.status(400).json('Error: ' + error)
  }
};

module.exports = {
  updateFiles: updateFiles
};