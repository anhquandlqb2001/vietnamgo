const topicsRouter = require("./topicsRouter");
const siteRouter = require("./sitesRouter")
const locationRouter = require("./locationRouter")
const authRouter = require("./authRouter")
const userRouter = require("./userRouter")
const routes = (app) => {

  app.use("/api/location", locationRouter);

  app.use("/api/topics", topicsRouter);

  app.use("/api/auth", authRouter);

  app.use("/api", siteRouter);

  app.use("/api/user", userRouter);
  
};

module.exports = routes;
