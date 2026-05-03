import { Schema, model } from "mongoose";

import { IUser } from "../types/interface";

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, require, required: true },
    email: { type: String, unique: true, required: true },
    termsAndCondition: { type: Boolean, required: true },
  },
  { timestamps: true },
);

const UserModel = model("User", userSchema);

export default UserModel;
