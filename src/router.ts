import { Express, Request, Response } from "express";

import { apiResponse } from "@/util";
import { logger } from "@/util/logger";

import { upload } from "@/config/other.config";
import { authRoute, stegRoute, usersRoute } from "@/routes";
import { authenticateToken, errorHandler } from "@/middlewares";

export default (app: Express): void => {
  app.get("/health", (_req, res) => {
    apiResponse(res, 200, {
      data: null,
      status: "success",
      message: "Steganos Core API Running",
    });
    res.status(200).json();
  });

  app.use("/api/auth", authRoute);

  app.use(authenticateToken);

  app.use("/api/users", usersRoute);

  app.use("/api/steg", upload.single("image"), stegRoute);

  app.use((req: Request, res: Response) => {
    logger.warn("route not found", {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
    });

    apiResponse(res, 404, { status: "error", message: "Route not found" });
  });

  app.use(errorHandler);
};
