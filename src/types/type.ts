import { Request, Response } from "express";

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type THandlerFn = (req: Request, res: Response) => Promise<void>;
