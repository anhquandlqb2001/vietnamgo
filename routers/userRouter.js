const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController")


router.get('/down', userController.user_role_down_get)

router.get('/up', userController.user_role_up_get)

router.get('/', userController.user_list_get)

module.exports = router