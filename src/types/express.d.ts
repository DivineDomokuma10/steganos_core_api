import { IJwtPayload } from "../interface";

declare module "express-serve-static-core" {
  interface Request {
    user?: IJwtPayload;
  }
}

export {};
