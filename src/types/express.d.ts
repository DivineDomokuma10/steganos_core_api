import { IJwtPayload } from "@/types/interface";

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
      id?: string;
    }
  }
}

export {};
