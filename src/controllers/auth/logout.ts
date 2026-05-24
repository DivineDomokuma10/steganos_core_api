import { Request, Response } from "express";

import { apiResponse } from "../../util.ts";
import { clearCookie } from "../../services/auth/cookie.js";

const logoutController = async (req: Request, res: Response) => {
  try {
    clearCookie(res, "refreshToken");
  } catch (error) {
    const err = error as Error;

    apiResponse(res, 500, { status: "error", message: err.message });
    return;
  }
};
export default logoutController;
