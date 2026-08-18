import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { apiResponse } from "@/util";
import { config } from "@/config/";
import { clearCookie } from "@/services/auth/cookie";
import { IRefreshJwtPayload } from "@/types/interface";
import RefreshTokenModel from "@/model/refresh-token.model";

const logoutController = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    const decoded = jwt.verify(
      token,
      config.refreshTokenSecret,
    ) as IRefreshJwtPayload;

    await RefreshTokenModel.findOneAndUpdate(
      { tokenId: decoded.jti, revoked: false },
      { revoked: true },
    );
  }

  clearCookie(res, "refreshToken");
  apiResponse(res, 200, {
    data: null,
    status: "success",
    message: "Logout Successful",
  });
};
export default logoutController;
