import { Request, Response } from "express";

import { config } from "../../config";
import { apiResponse } from "../../util.ts";
import { verifyJwt } from "../../services/auth.service";
import { IRefreshJwtPayload } from "../../types/interface";

export const refreshController = async (req: Request, res: Response) => {
  try {
    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken) {
      apiResponse(res, 401, {
        status: "error",
        message: "No token",
      });

      return;
    }

    const decodedIncomingToken = verifyJwt<IRefreshJwtPayload>(
      incomingToken,
      config.refreshTokenSecret,
    );
  } catch (error) {
    const err = error as Error;

    if (err.message === "TOKEN_REUSE_DETECTED") {
      apiResponse(res, 401, {
        status: "error",
        message: "Session compromised. Please login again.",
      });

      return;
    }

    apiResponse(res, 401, {
      status: "error",
      message: "Invalid or expired token",
    });

    return;
  }
};
