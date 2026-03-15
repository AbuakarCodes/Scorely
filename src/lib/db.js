import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}