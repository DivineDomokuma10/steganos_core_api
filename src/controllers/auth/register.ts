import { Request, Response } from "express";

import UserModel from "../../model/user.model";
import { apiResponse, hasher } from "../../util.ts";
import { createToken, setCookie } from "../../services/auth.service";

const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      apiResponse(res, 400, {
        status: "error",
        message: "All fields are required",
      });

      return;
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      apiResponse(res, 409, {
        status: "error",
        message: "User already exists",
      });

      return;
    }

    const hashedPwd = await hasher(password);

    const newUser = await UserModel.create({
      email,
      username,
      password: hashedPwd,
    });

    const { token: accessToken } = createToken(
      {
        userId: newUser._id.toString(),
      },
      "access",
    );

    const { token: refreshToken } = createToken(
      {
        userId: newUser._id.toString(),
      },
      "refresh",
    );

    setCookie(res, "refresh_token", refreshToken, 60 * 60 * 1000);

    apiResponse(res, 201, {
      status: "success",
      message: "Account created successfully",
      data: {
        accessToken,
        userId: newUser._id.toString(),
      },
    });

    return;
  } catch (error) {
    const err = error as Error;

    apiResponse(res, 500, {
      status: "error",
      message: err.message,
    });

    return;
  }
};

export default registerController;
