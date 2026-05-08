import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ALLOWED_ORIGINS } from "../util.ts/constants";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV!,
  mongoUri: process.env.MONGO_URI!,
  saltRound: process.env.SALTROUNDS!,
  port: process.env.PORT! as unknown as number,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE_TIME!,
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE_TIME!,
};

export function connectDB() {
  mongoose
    .connect(config.mongoUri, {
      retryWrites: true,
      w: "majority",
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

export const configCORS = () =>
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowed =
        config.nodeEnv === "production"
          ? ["https://your-frontend.com"]
          : ALLOWED_ORIGINS;

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
  });
