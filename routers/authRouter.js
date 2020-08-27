const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.auth_login_post);
router.post(
  "/register",
  authController.auth_register_checkEmailExist,
  authController.auth_register_post
);

module.exports = router;
