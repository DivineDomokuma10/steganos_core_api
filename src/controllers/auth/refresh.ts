import { Request, Response } from "express";

import { apiResponse } from "../../util.ts";
import { REFRESH_TOKEN_TTL } from "../../util.ts/constants";

import UserModel from "../../model/user.model";
import { setCookie } from "../../services/auth/cookie";
import { refreshTokenRotator } from "../../services/auth/refreshTokenRotator";

const refreshController = async (req: Request, res: Response) => {
  console.log("---------------------");
  console.log(`Endpoint: ${req.path}`);
  console.log(`Client: ${req.headers.origin}`);
  console.log("refresh token", req.cookies.refreshToken);
  console.log("---------------------");

  try {
    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken) {
      apiResponse(res, 401, {
        status: "error",
        message: "NO_REFRESH_TOKEN",
      });
      return;
    }

    const { accessToken, refreshToken, userId } =
      await refreshTokenRotator(incomingToken);

    setCookie(res, "refreshToken", refreshToken, REFRESH_TOKEN_TTL);

    const user = await UserModel.findById(userId);

    if (!user) {
      apiResponse(res, 404, {
        status: "error",
        message: "USER_NOT_FOUND",
      });

      return;
    }

    const { email, username } = user;

    apiResponse(res, 200, {
      status: "success",
      data: { accessToken, userId, username, email },
      message: "REFRESH_SUCCESS",
    });
    return;
  } catch (error) {
    const err = error as Error;

    if (err.message === "TOKEN_TAMPERED") {
      res.clearCookie("refreshToken");
      apiResponse(res, 401, {
        status: "error",
        message: "TOKEN_TAMPERED",
      });
      return;
    }

    if (err.message === "TOKEN_EXPIRED") {
      res.clearCookie("refreshToken");
      apiResponse(res, 401, {
        status: "error",
        message: "REFRESH_TOKEN_EXPIRED",
      });
      return;
    }

    if (err.message === "TOKEN_ALREADY_USED") {
      apiResponse(res, 401, {
        status: "error",
        message: "TOKEN_ALREADY_USED",
      });
      return;
    }

    if (err.message === "TOKEN_NOT_FOUND") {
      res.clearCookie("refreshToken");
      apiResponse(res, 401, {
        status: "error",
        message: "TOKEN_NOT_FOUND",
      });

      return;
    }

    if (err.message === "INVALID_TOKEN") {
      res.clearCookie("refreshToken");
      apiResponse(res, 401, {
        status: "error",
        message: "INVALID_REFRESH_TOKEN",
      });

      return;
    }
    apiResponse(res, 500, {
      status: "error",
      message: "REFRESH_HANDLER_ERROR",
    });
    return;
  }
};

export default refreshController;
