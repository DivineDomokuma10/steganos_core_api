import { Express } from "express";

import stegRoute from "./routes/steg.route";
import authRoute from "./routes/auth.route";
import userRoute from "./routes/users.route";

import { upload } from "./config";
import { authenticateToken } from "./middlewares/auth.middleware";

export default (app: Express): void => {
  app.get("/health", (_, res) => {
    res
      .status(200)
      .json({ status: "success", message: "Steganos Core API Running" });
  });

  app.use("/api/auth", authRoute);

  app.use(authenticateToken);

  app.use("/api/users", userRoute);

  app.use("/api/steg", upload.single("image"), stegRoute);
};
