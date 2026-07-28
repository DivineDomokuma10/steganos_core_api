import { Request, Response } from "express";

import { apiResponse } from "@/util";
import { clearCookie } from "@/services/auth/cookie";

const logoutController = async (_req: Request, res: Response) => {
  clearCookie(res, "refreshToken");
  apiResponse(res, 200, {
    data: null,
    status: "success",
    message: "Logout Successful",
  });
};
export default logoutController;
