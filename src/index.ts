import express from "express";
import cookieParser from "cookie-parser";

import router from "./router";
import { config, configCORS, connectDB } from "./config";
// import { jsonToBits } from "./util.ts/helpers";

const app = express();

app.use(configCORS());

app.use(express.json());

app.use(cookieParser());

connectDB();

// console.log(jsonToBits({ age: "2", name: "divine" }));

app.listen(config.port, "0.0.0.0", () => {
  router(app);
  console.log(`Server running at http://localhost:${config.port}`);
});
