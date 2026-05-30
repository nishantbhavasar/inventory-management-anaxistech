import config from "./index.js";
import mongoose from "mongoose";

export async function dbConnect() {
  try {
    let connection = await mongoose.connect(config.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${connection?.connection?.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}
