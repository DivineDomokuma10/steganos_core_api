import dotenv from "dotenv";
import { AppError } from "@/util/errors";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "MONGO_URI",
  "SALTROUNDS",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRE_TIME",
  "REFRESH_TOKEN_EXPIRE_TIME",
] as const;

const missingVars = requiredEnvVars.filter(
  (key) => !!process.env[key] === false,
);

if (missingVars.length > 0) {
  throw new AppError(
    500,
    `Missing required environment variables: ${missingVars.join(", ")}`,
  );
}

export const config = {
  nodeEnv: process.env.NODE_ENV!,
  mongoUri: process.env.MONGO_URI!,
  saltRound: process.env.SALTROUNDS ?? "10",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  port: Number(process.env.PORT) || 5000,
  accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE_TIME!,
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE_TIME!,
};
