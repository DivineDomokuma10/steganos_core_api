import { Request, Response } from "express";

import { setCookie } from "../../services/auth/cookie";
import { createToken } from "../../services/auth/verify-create-jwt";

import UserModel from "../../model/user.model";
import RefreshTokenModel from "../../model/refresh-token.model";

import { IRefreshJwtPayload } from "../../types/interface";

import { uuid } from "../../util/helpers";
import { REFRESH_TOKEN_TTL } from "../../util/constants";
import { apiResponse, compare, hasher } from "../../util";

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      apiResponse(res, 400, {
        status: "error",
        message: "All fields are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      apiResponse(res, 401, {
        status: "error",
        message: "Invalid Credentials",
      });

      return;
    }

    const isPwdCorrect = await compare(password, user.password);

    if (!isPwdCorrect) {
      apiResponse(res, 400, {
        status: "error",
        message: "Invalid Credentials",
      });

      return;
    }

    const { token: accessToken } = createToken(
      {
        userId: user._id.toString(),
      },
      "access",
    );

    const refreshTokenId = uuid();

    const { token: refreshToken } = createToken<IRefreshJwtPayload>(
      {
        jti: refreshTokenId,
        userId: user._id.toString(),
      },
      "refresh",
    );

    setCookie(res, "refreshToken", refreshToken, REFRESH_TOKEN_TTL);

    const hashedRefreshToken = await hasher(refreshToken);

    await RefreshTokenModel.create({
      revoked: false,
      tokenId: refreshTokenId,
      userId: user._id.toString(),
      tokenHash: hashedRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    apiResponse(res, 201, {
      status: "success",
      message: "Login Successful",
      data: {
        email,
        accessToken,
        username: user.username,
        userId: user._id.toString(),
      },
    });

    return;
  } catch (error) {
    const err = error as Error;

    apiResponse(res, 500, { status: "error", message: err.message });

    return;
  }
};

export default loginController;
