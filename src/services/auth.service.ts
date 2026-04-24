import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

import { config } from "../config";

import { Response } from "express";
import { TPayLoad, TTokenType } from "../types/auth";
import { ICreateTokenReturns } from "../types/interface";

export function verifyJwt(token: string, secret: string) {
  return jwt.verify(token, secret);
}

export function createToken(
  payload: TPayLoad,
  type: TTokenType,
): ICreateTokenReturns {
  const token = jwt.sign(
    payload,
    type === "access" ? config.accessTokenSecret : config.refreshTokenSecret,
    {
      algorithm: "HS256",
      expiresIn: (type === "access"
        ? config.accessTokenExpire
        : config.refreshTokenExpire) as StringValue,
    },
  );

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
