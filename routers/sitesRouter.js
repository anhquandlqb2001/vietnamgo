const express = require("express");
const router = express.Router();
const siteController = require("../controllers/siteController");
const upload = require("../config/multerConfig");
const multerController = require("../controllers/multerController");
const auth_token = require("../middleware/authenticateToken");
const { adminPermission } = require("../middleware/authorization");

router.get("/slideimg", siteController.site_slideImage_get);
router.post(
  "/slideimg",
  auth_token,
  adminPermission,
  upload.array("slide-img"),
  multerController.uploadMultipleFiles,
  siteController.site_slideImage_post
);

module.exports = router;
