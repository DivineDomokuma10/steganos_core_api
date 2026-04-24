import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import router from "./router";
import { config, connectDB } from "./config";

const app = express();

app.use(
  cors({
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

connectDB();

app.listen(config.port, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    router(app);
    console.log(`Server running at localhost:${config.port}`);
  }
});
