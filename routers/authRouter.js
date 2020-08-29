const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  checkNotAuthenticated,
} = require("../middleware/checkAuthenticated");

router.post(
  "/login",
  checkNotAuthenticated,
  authController.auth_login_validate,
  authController.auth_login_verify
);
router.post(
  "/register",
  checkNotAuthenticated,
  authController.auth_register_checkEmailExist,
  authController.auth_register_post
);

module.exports = router;
