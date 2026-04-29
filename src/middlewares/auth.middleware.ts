import { NextFunction, Request, Response } from "express";

import { config } from "../config";
import { apiResponse } from "../util.ts";
import { IJwtPayload } from "../types/interface";
import { verifyJwt } from "../services/auth/verify-create-jwt";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      apiResponse(res, 401, {
        status: "error",
        message: "Unauthorized: No token",
      });

      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyJwt<IJwtPayload>(token, config.accessTokenSecret);

    req.user = decoded;

    next();
  } catch (error) {
    const err = error as Error;

    if (err.message === "TOKEN_EXPIRED") {
      apiResponse(res, 401, {
        status: "error",
        message: "Session expired. Please login again.",
      });

      return;
    }

    if (err.message === "INVALID_TOKEN") {
      apiResponse(res, 401, {
        status: "error",
        message: "Invalid authentication token",
      });

      return;
    }

    apiResponse(res, 500, {
      status: "error",
      message: "Internal server error",
    });

    return;
  }
}
