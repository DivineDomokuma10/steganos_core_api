import compression from "compression";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";

import router from "./router";
import { configCORS } from "./config";

const app = express();

app.use(compression());

app.use(configCORS());

app.use(express.json());

app.use(cookieParser());

router(app);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
