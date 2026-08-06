import { NextFunction, Request, Response, Express } from "express";

import stegRoute from "@/routes/steg.route";
import authRoute from "@/routes/auth.route";
import userRoute from "@/routes/users.route";

import { upload } from "@/config";
import { authenticateToken } from "@/middlewares/auth.middleware";

export default (app: Express): void => {
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: err.message || "Internal Server Error",
    });
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
  });

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
