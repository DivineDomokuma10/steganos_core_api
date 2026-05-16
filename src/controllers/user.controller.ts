import { Request, Response } from "express";
import UserModel from "../model/user.model";
import { apiResponse } from "../util.ts";
import { extractor } from "../util.ts/helpers";

export const getProfile = async (req: Request, res: Response) => {
  console.log("---------------------");
  console.log(`Endpoint: ${req.path}`);
  console.log(`Client: ${req.headers.origin}`);
  console.log("---------------------");

  try {
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
    } else {
      apiResponse(res, 404, {
        status: "error",
        message: "User profile not found",
      });

      return;
    }
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};
