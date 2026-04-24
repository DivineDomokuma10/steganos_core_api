import { JwtPayload } from "jsonwebtoken";

export interface IUser {
  email: string;
  username: string;
  password: string;
}

export interface ICreateTokenReturns {
  token: string;
}
