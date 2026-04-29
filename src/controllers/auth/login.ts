import { Request, Response } from "express";

import { uuid } from "../../util.ts/helpers";
import UserModel from "../../model/user.model";
import { apiResponse, compare, hasher } from "../../util.ts";
import { IRefreshJwtPayload } from "../../types/interface";
import { createToken, setCookie } from "../../services/auth.service";
import RefreshTokenModel from "../../model/refresh-token.model";

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
        message: "Invalid credentials",
      });

      return;
    }

    const isPwdCorrect = await compare(password, user.password);

    if (!isPwdCorrect) {
      apiResponse(res, 401, {
        status: "error",
        message: "Invalid credentials",
      });

      return;
    }

    const { token: accessToken } = createToken(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "access",
    );

    const refreshTokenId = uuid();

    const { token: refreshToken } = createToken<IRefreshJwtPayload>(
      {
        email: user.email,
        jti: refreshTokenId,
        userId: user._id.toString(),
      },
      "refresh",
    );

    setCookie(res, "refreshToken", refreshToken, 1 * 60 * 60 * 1000);

    await RefreshTokenModel.create({
      revoked: false,
      tokenId: refreshTokenId,
      userId: user._id.toString(),
      tokenHash: hasher(refreshToken),
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    apiResponse(res, 201, {
      status: "success",
      message: "Login successfully",
      data: {
        accessToken,
        userId: user._id.toString(),
      },
    });

    return;
  } catch (error) {
    const err = error as Error;

    res.status(500).send({
      error: err.name,
      message: err.message,
    });

    return;
  }
};

export default loginController;
