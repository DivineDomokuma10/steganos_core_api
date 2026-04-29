import jwt from "jsonwebtoken";
import { Response } from "express";
import type { StringValue } from "ms";

import { config } from "../config";
import { TTokenType } from "../types/auth";

import {
  IJwtPayload,
  IRefreshJwtPayload,
  ICreateTokenReturns,
} from "../types/interface";
import RefreshTokenModel from "../model/refresh-token.model";

export function verifyJwt<T>(token: string, secret: string): T {
  try {
    return jwt.verify(token, secret) as T;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new Error("TOKEN_EXPIRED");
    }

    if (err.name === "JsonWebTokenError") {
      throw new Error("INVALID_TOKEN");
    }
    throw err;
  }
}

export function createToken<T extends IJwtPayload>(
  payload: T,
  type: TTokenType,
): ICreateTokenReturns {
  const secret =
    type === "access" ? config.accessTokenSecret : config.refreshTokenSecret;

  const expire =
    type === "access" ? config.accessTokenExpire : config.refreshTokenExpire;

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expire as StringValue,
  });

  return { token };
}

export function setCookie(
  res: Response,
  name: string,
  value: string,
  age: number,
) {
  res.cookie(name, value, {
    httpOnly: true,
    maxAge: age,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "strict" : "none",
  });
}

export async function refreshTokenRotator(oldToken: string) {
  const decoded = verifyJwt<IRefreshJwtPayload>(
    oldToken,
    config.refreshTokenSecret,
  );

  const refreshTokenFromDB = await RefreshTokenModel.findOne({
    tokenId: decoded.jti,
  });
}
