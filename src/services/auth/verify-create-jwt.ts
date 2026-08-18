import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

import { config } from "@/config/";
import { AppError } from "@/util/errors";

import { TTokenType } from "@/types/auth";
import { ICreateTokenReturns, IJwtPayload } from "@/types/interface";

export function verifyJwt<T>(token: string, secret: string): T {
  try {
    return jwt.verify(token, secret) as T;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new AppError(401, "TOKEN_EXPIRED");
    }

    if (err.name === "JsonWebTokenError") {
      throw new AppError(401, "INVALID_TOKEN");
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
