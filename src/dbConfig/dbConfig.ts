import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI!);
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.error("✅ MongoDB connected successfully");
    });

    connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1); // Exit the process if there's an error
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process if there's an error
  }
}