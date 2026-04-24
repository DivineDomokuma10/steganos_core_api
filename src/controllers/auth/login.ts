import { Request, Response } from "express";

import UserModel from "../../model/user.model";
ss;
import { apiResponse, compare } from "../../util.ts";
import { createToken, setCookie } from "../../services/auth.service";

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
        userId: user._id.toString(),
      },
      "access",
    );

    const { token: refreshToken } = createToken(
      {
        userId: user._id.toString(),
      },
      "refresh",
    );

    setCookie(res, "refresh_token", refreshToken, 60 * 60 * 1000);

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
