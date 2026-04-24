import { Request, Response } from "express";

import { compare } from "../../util.ts";
import UserModel from "../../model/user.model";
import { createToken, setCookie } from "../../services/auth.service";

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({
        status: "error",
        message: "All fields are required!",
      });

      return;
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).send({
        status: "error",
        message: "Invalid credentials",
      });

      return;
    }

    const isPwdCorrect = await compare(password, user.password);

    if (!isPwdCorrect) {
      res.status(401).send({
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

    res.status(200).send({
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
