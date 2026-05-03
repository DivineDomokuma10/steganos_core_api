import { Request, Response } from "express";

import { apiResponse } from "../../util.ts";
import { REFRESH_TOKEN_TTL } from "../../util.ts/constants";

import { setCookie } from "../../services/auth/cookie";
import { refreshTokenRotator } from "../../services/auth/refreshTokenRotator";

const refreshController = async (req: Request, res: Response) => {
  console.log(`Endpoint: ${req.path}`);
  console.log(`Host: ${req.host}`);

  try {
    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken) {
      apiResponse(res, 401, {
        status: "error",
        message: "No token",
      });

      return;
    }

    const { accessToken, refreshToken } =
      await refreshTokenRotator(incomingToken);

    setCookie(res, "refreshToken", refreshToken, REFRESH_TOKEN_TTL);

    apiResponse(res, 200, {
      status: "success",
      data: { accessToken },
      message: "Refresh successful",
    });

    return;
  } catch (error) {
    const err = error as Error;

    if (err.message === "TOKEN_REUSE_DETECTED") {
      apiResponse(res, 401, {
        status: "error",
        message: "Session compromised. Please login again.",
      });

      return;
    }

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
};

export default refreshController;
