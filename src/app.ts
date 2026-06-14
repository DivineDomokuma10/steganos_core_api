import express, { Request, Response } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";

import router from "./router";
import { configCORS } from "./config";

const app = express();

app.use(compression());

app.use(configCORS());

app.use(express.json());

app.use(cookieParser());

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

router(app);

export default app;
