import { Request, Response } from "express";
import UserModel from "../model/user.model";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const users = await UserModel.find();

      res.status(200).send({
        data: users,
      });
    } else {
      res.status(401).send({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};
