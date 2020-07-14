const express = require("express")
const User = require('../models/user.models')
const router = express.Router()
const bcrypt = require('bcrypt')

router.post('/', checkEmailExist, async (req, res) => {
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