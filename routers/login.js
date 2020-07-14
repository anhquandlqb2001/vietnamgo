const express = require("express")
const User = require('../models/user.models')
const router = express.Router()
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  
  await User.findOne({email: email}, async (e, result) => {
    if (result==null) {
      res.json({status: false, message: 'Sai địa chỉ email'})
    } else {
      try {
        if (await bcrypt.compare(password, result.password)) {
          res.json({status: true, user: {username: result.username, role: result.role, id: result._id}, message: 'Đăng nhập thành công'})
        } else {
          res.json({status: false, message: 'Đăng nhập thất bại, sai mật khẩu'})
        }
      } catch (e) {
        
      }
    }
  })

})

module.exports = router