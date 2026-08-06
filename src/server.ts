import app from "@/app";
import { config, connectDB } from "@/config";

async function start() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

start();