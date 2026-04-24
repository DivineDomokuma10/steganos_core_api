import { hasher } from "../../util.ts";
import { Request, Response } from "express";

import UserModel from "../../model/user.model";
import { createToken, setCookie } from "../../services/auth.service";

const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.status(400).send({ error: "All fields are required" });
      return;
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(409).send({ status: "ERROR", message: "User already exists" });
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

    res.status(201).send({
      data: {
        accessToken,
        userId: newUser._id.toString(),
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

export default registerController;
