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
      return apiResponse(res, 401, {
        status: "error",
        message: "NO_ACCESS_TOKEN",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyJwt<IJwtPayload>(token, config.accessTokenSecret);

    req.user = decoded;

    return next();
  } catch (error) {
    const err = error as Error;

    if (err.message === "TOKEN_EXPIRED") {
      return apiResponse(res, 401, {
        status: "error",
        message: "ACCESS_TOKEN_EXPIRED",
      });
    }

    if (err.message === "INVALID_TOKEN") {
      return apiResponse(res, 401, {
        status: "error",
        message: "INVALID_ACCESS_TOKEN",
      });
    }

    return apiResponse(res, 500, {
      status: "error",
      message: "AUTH_MIDDLEWARE_ERROR",
    });
  }
}
