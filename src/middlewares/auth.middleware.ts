import { NextFunction, Request, Response } from "express";

import { config } from "../config";
import { verifyJwt } from "../services/auth.service";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).send({
        message: "Access Denied, No token provided",
      });
    }

    const decoded = verifyJwt(token, config.accessTokenSecret);

    if (typeof decoded === "object") {
      const { email, username } = decoded;

      req.user = { email, username };

      next();
    } else {
      res.status(401).send({
        message: "Access Denied, Invalid token",
      });
    }
  } catch (error) {
    let err = error as Error;

    res.status(500).send({ error: err.name, message: err.message });
  }
}
