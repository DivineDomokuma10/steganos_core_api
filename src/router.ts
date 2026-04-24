import { Express } from "express";

import authRoute from "./routes/auth.route";
import userRoute from "./routes/users.route";

export default (app: Express): void => {
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
};
