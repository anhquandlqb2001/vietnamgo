require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const routes = require('./routers')
const db = require("./config/mongooseConfig")

const app = express();
const port = process.env.PORT || 5000;

// connect to database
db.connect()

app.use(express.static(path.join(__dirname, "client", "build")));

app.use(cors());
app.use(express.json());

// routes
routes(app)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log("Listen on port " + port);
});
