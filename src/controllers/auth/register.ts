import { Request, Response } from "express";

import UserModel from "../../model/user.model";
import { apiResponse, hasher } from "../../util.ts";

const registerController = async (req: Request, res: Response) => {
  try {
    console.log(`Endpoint: ${req.path}`);
    console.log(`Payload: ${req.body}`);
    console.log(`Origin: ${req.headers.origin}`);

    const { email, password, username, termsAndCondition } = req.body;

    if (!email || !password || !username || !termsAndCondition) {
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
      termsAndCondition,
      password: hashedPwd,
    });

    apiResponse(res, 201, {
      status: "success",
      message: "Account created successfully",
      data: {
        email,
        username,
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
