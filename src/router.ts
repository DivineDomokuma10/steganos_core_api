import { Express } from "express";

import authRoute from "./routes/auth.route";
import userRoute from "./routes/users.route";
import { authenticateToken } from "./middlewares/auth.middleware";

export default (app: Express): void => {
  app.use("/api/auth", authRoute);
  app.use(authenticateToken);
  app.use("/api/users", userRoute);
};
