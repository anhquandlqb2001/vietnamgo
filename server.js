require('dotenv').config()
const path = require('path');
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const topicsRouter = require('./routers/topics');
const signupRouter = require('./routers/signup');
const indexRouter = require('./routers/index');
const loginRouter = require('./routers/login');
const locationRouter = require('./routers/location');

const app = express()
const port = process.env.PORT || 5000

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// console.log(process.env.PORT)

const connection = mongoose.connection
connection.once('open', () => {
  console.log('Connected to database')
})

app.use(express.static(path.join(__dirname, "client", "build")))
app.use(express.static("public/uploads"))
app.use(express.static("public/locationimg"))
app.use(express.static("public/slideimg"))
app.use(cors())
app.use(express.json())
app.use('/', indexRouter)
app.use('/topics', topicsRouter)
app.use('/signup', signupRouter)
app.use('/login', loginRouter)
app.use('/location', locationRouter)

// app.listen(port, () => {
//   console.log(`Listen on ${port}`)
// })

app.listen(process.env.PORT, "0.0.0.0", () => {console.log('app on port' + process.env.PORT)})