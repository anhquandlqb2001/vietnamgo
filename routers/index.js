const topicsRouter = require("./topicsRouter");
const siteRouter = require("./sitesRouter");
const locationRouter = require("./locationRouter");
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");

const auth_token = require("../middleware/authenticateToken");
const { adminPermission } = require("../middleware/authorization");
const routes = (app) => {
  app.use("/api/location", locationRouter);

  app.use("/api/topics", topicsRouter);

  app.use("/api/auth", authRouter);

  app.use("/api", siteRouter);

  app.use("/api/user", auth_token, adminPermission, userRouter);
};

module.exports = routes;
