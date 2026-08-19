import { Request, Response } from "express";

import UserModel from "@/model/user.model";
import { apiResponse, hasher } from "@/util";

const registerController = async (req: Request, res: Response) => {
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

  await UserModel.create({
    email,
    username,
    password: hashedPwd,
  });

  apiResponse(res, 201, {
    data: null,
    status: "success",
    message: "Account created successfully",
  });

  return;
};

export default registerController;
