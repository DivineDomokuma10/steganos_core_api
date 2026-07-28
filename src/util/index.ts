import bcrypt from "bcrypt";
import { NextFunction, Response, Request } from "express";
import { TApiResponse, THandlerFn } from "../types/type";

export async function hasher(pwd: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pwd, salt);
}

export async function compare(pwd: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(pwd, hash);
}

export function apiResponse<T>(
  res: Response,
  statusCode: number,
  payload: TApiResponse<T>,
) {
  return res.status(statusCode).json(payload);
}

export function asyncHandler(fn: THandlerFn) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
