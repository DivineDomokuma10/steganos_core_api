import { Response } from "express";

import { config } from "../../config";

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
