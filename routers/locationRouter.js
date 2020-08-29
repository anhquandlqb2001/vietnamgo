const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const upload = require("../config/multerConfig");
const multerController = require("../controllers/multerController");
const verify_token = require("../middleware/authenticateToken");
const { adminPermission } = require("../middleware/authorization");

router.get("/favourite", locationController.location_favourite_get);
router.post(
  "/add",
  verify_token,
  adminPermission,
  upload.single("profile"),
  locationController.location_add_checkExist_post,
  multerController.uploadSingleFile,
  locationController.location_add_post
);

router.get("/", locationController.location_list_get);

module.exports = router;
