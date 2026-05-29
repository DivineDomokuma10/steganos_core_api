import { Request, Response } from "express";

import { apiResponse } from "../../util/";
import { clearCookie } from "../../services/auth/cookie";

const logoutController = async (_req: Request, res: Response) => {
  try {
    clearCookie(res, "refreshToken");
    apiResponse(res, 500, {
      data: null,
      status: "success",
      message: "Logout Successful",
    });
  } catch (error) {
    const err = error as Error;

    apiResponse(res, 500, { status: "error", message: err.message });
    return;
  }
};
export default logoutController;
