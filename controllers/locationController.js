const LocationModel = require("../models/location.models")

class LocationController {
  async location_add_checkExist_post(req, res, next) {
    try {
      const checkExistLocation = await LocationModel.findOne({
        address: req.body.address,
      });
      if (!checkExistLocation) {
        return next();
      }
      return res.json({ success: false, message: "Dia diem da ton tai" });
    } catch (error) {
      return res.json({ success: false, error });
    }
  }

  async location_add_post(req, res) {
    try {
      const newLocation = new LocationModel({
        address: req.body.address,
        image: req.imageDetails,
      });
      await newLocation.save();
      return res.json({ success: true, message: "Them dia diem thanh cong" });
    } catch (error) {
      res.json({ success: false, error });
    }
  }

  location_list_get(req, res) {
    LocationModel.find({}, (e, result) => {
      res.json(result);
    });
  }

  location_favourite_get(req, res) {
    LocationModel.find({})
      .sort({ totalWatch: -1 })
      .limit(4)
      .exec((e, result) => {
        res.json(result);
      });
  }
}

module.exports = new LocationController();
