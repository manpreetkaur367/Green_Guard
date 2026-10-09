import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/greenguard";

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully.");
    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error.message);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
