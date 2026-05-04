import express from "express";
import cookieParser from "cookie-parser";

import router from "./router";
import { config, configCORS, connectDB } from "./config";

const app = express();

app.use(configCORS());

app.use(express.json());

app.use(cookieParser());

connectDB();

app.listen(config.port, () => {
  router(app);
  console.log(`Server running at http://0.0.0.0:${config.port}`);
});
