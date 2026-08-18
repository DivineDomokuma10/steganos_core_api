import { randomUUID } from "node:crypto";
import { NextFunction, Request, Response } from "express";

import { logger } from "@/util/logger";

export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.id = randomUUID();
    res.setHeader("X-Request-Id", req.id);

    const startedAt = Date.now();

    res.on("finish", () => {
      logger.info("request completed", {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTimeMs: Date.now() - startedAt,
        ip: req.ip,
      });
    });

    next();
  };
}
