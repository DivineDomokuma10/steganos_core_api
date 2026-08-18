import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";

import {
  IMAGE_MAX_SIZE,
  DEV_ALLOWED_ORIGINS,
  PROD_ALLOWED_ORIGINS,
} from "@/util/constants";
import { AppError } from "@/util/errors";

import { config } from "./env.config";

export function connectDB() {
  return mongoose.connect(config.mongoUri, {
    retryWrites: true,
    w: "majority",
  });
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
      cb(new AppError(400, "Only PNG images allowed"));
    }
  },
});
