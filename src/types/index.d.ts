import { IJwtPayload } from "./interface";

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayloadload;
    }
  }
}
