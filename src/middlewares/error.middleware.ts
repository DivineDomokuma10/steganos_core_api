import { NextFunction, Request, Response } from "express";
import multer from "multer";

import { AppError } from "@/util/errors";
import { logger } from "@/util/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(err.message, {
    requestId: req.id,
    stack: err.stack,
  });

  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message = err.message;
  }

  res.status(status).json({ status: "error", message });
}