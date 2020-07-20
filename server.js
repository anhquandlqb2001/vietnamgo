require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const topicsRouter = require("./routers/topics");
const indexRouter = require("./routers/index");
const authRouter = require("./routers/auth");
const locationRouter = require("./routers/location");
const userRouter = require("./routers/user");

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(process.env.PORT)

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to database");
});

app.use(express.static(path.join(__dirname, "client", "build")));


app.use(express.static("public/uploads"));
app.use(express.static("public/locationimg"));
app.use(express.static("public/slideimg"));
app.use(cors());
app.use(express.json());
app.use("/api", indexRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/auth", authRouter);
app.use("/api/location", locationRouter);
app.use("/api/user", userRouter);


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log("Listen on port " + port);
});
