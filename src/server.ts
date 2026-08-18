import mongoose from "mongoose";

import app from "@/app";
import { config, connectDB } from "@/config";
import { logger } from "@/util/logger";

process.on("unhandledRejection", (reason) => {
  logger.fatal("unhandled promise rejection", { reason: String(reason) });
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.fatal("uncaught exception", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

async function start() {
  try {
    await connectDB();
    logger.info("connected to MongoDB");
  } catch (err) {
    const error = err as Error;
    logger.fatal("MongoDB connection failed", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error", { message: String(err) });
  });

  const server = app.listen(config.port, () => {
    logger.info("server started", { port: config.port });
  });

  server.on("error", (err) => {
    logger.fatal("server error", { message: (err as Error).message });
    process.exit(1);
  });

  const shutdown = (signal: string) => {
    logger.info("shutdown initiated", { signal });

    server.close(async () => {
      try {
        await mongoose.disconnect();
        logger.info("shutdown complete");
        process.exit(0);
      } catch (err) {
        logger.error("error during shutdown", {
          message: (err as Error).message,
        });
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error("forced shutdown after timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start();
