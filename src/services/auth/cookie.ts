import { Response } from "express";
import { config } from "../../config";

export function setCookie(
  res: Response,
  name: string,
  value: string,
  age: number,
) {
  const isProd = config.nodeEnv === "production";

  res.cookie(name, value, {
    httpOnly: true,
    maxAge: age,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

export function clearCookie(res: Response, name: string) {
  const isProd = config.nodeEnv === "production";

  res.clearCookie(name, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}
