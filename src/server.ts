import app from "./app";
import { config, connectDB } from "./config";

connectDB();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
