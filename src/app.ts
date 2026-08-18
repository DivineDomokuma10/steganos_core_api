import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";

import router from "@/router";
import { configCORS } from "@/config/";
import { requestLogger } from "@/middlewares/request.logger.middleware";

const app = express();

app.set("trust proxy", 1);

app.use(compression());

app.use(configCORS());

app.use(express.json());

app.use(cookieParser());

app.use(requestLogger());

router(app);

export default app;
