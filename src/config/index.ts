import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import mongoose from "mongoose";

import {
  IMAGE_MAX_SIZE,
  DEV_ALLOWED_ORIGINS,
  PROD_ALLOWED_ORIGINS,
} from "../util/constants";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV!,
  mongoUri: process.env.MONGO_URI!,
  saltRound: process.env.SALTROUNDS!,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  port: (process.env.PORT! as unknown as number) || 5000,
  accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE_TIME!,
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE_TIME!,
};

export function connectDB() {
  mongoose
    .connect(config.mongoUri, {
      retryWrites: true,
      w: "majority",
    })
    .then(() => {})
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

export const configCORS = () =>
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowed =
        config.nodeEnv === "production"
          ? PROD_ALLOWED_ORIGINS
          : DEV_ALLOWED_ORIGINS;

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
  });

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fieldSize: 20 * 1024 * 1024,
    fileSize: IMAGE_MAX_SIZE * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG images allowed"));
    }
  },
});
