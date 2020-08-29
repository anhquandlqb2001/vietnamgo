const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.put("/:id/down", userController.user_role_down_put);

router.put("/:id/up",  userController.user_role_up_put);

router.get("/", userController.user_list_get);

module.exports = router;
