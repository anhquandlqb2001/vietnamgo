const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const upload = require("../config/multerConfig");
const multerController = require("../controllers/multerController");

router.get('/favourite', locationController.location_favourite_get)
router.post(
  "/add",
  upload.single("profile"),
  locationController.location_add__checkExist_post,
  multerController.uploadSingleFile,
  locationController.location_add_post
);

router.get("/", locationController.location_list_get);

module.exports = router;
