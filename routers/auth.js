const express = require("express")
const User = require('../models/user.models')
const router = express.Router()
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
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

router.post('/register', checkEmailExist, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword
    })
    
    const user = await newUser.save()
    res.json({user, message: 'Tạo tài khoản thành công'})
    
  } catch (error) {
    
  }
})

async function checkEmailExist(req, res, next) {
  try {
    let check = await User.find({email: req.body.email})
    if (check.length===0) {
      next()
    } else {
      res.json('Email đã tồn tại')
    }
  } catch (error) {
    
  }
}

module.exports = router
