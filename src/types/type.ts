import { Request, Response, NextFunction } from "express";

export type TApiSuccess<T> = {
  data: T;
  message: string;
  status: "success";
};

export type TApiError = {
  message: string;
  status: "error";
};

export type TDecodedPayload = {
  iv: string;
  salt: string;
  ciphertext: string;
};

export type TDataSizeUnit = "KB" | "MB" | "GB";

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type TApiResponse<T> = TApiSuccess<T> | TApiError;

export type TBits = 8 | 16 | 32;

export type THandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;
