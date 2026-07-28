import { Request, Response } from "express";

import { apiResponse } from "@/util/";
import UserModel from "@/model/user.model";
import { extractor } from "@/util/helpers";

export const getProfile = async (req: Request, res: Response) => {
  const me = req.user;

  if (!me) {
    apiResponse(res, 401, {
      status: "error",
      message: "Unauthorized",
    });

    return;
  }

  const profile = await UserModel.findOne({ _id: me.userId });

  if (profile) {
    const data = extractor(profile, ["username", "email", "_id"]);

    apiResponse(res, 200, {
      data,
      status: "success",
      message: "User profile retrieved successfully",
    });

    return;
  }

  apiResponse(res, 404, {
    status: "error",
    message: "User profile not found",
  });
};
