import mongoose from "mongoose";

const connectDB = async () => {
  const primaryMongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/greenguard";
  const fallbackMongoURI = "mongodb://localhost:27017/greenguard";
  const candidateURIs = [...new Set([primaryMongoURI, fallbackMongoURI])];

  let lastError = null;

  for (const mongoURI of candidateURIs) {
    try {
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
      console.log(`MongoDB connected successfully using ${mongoURI}`);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`MongoDB connection failed for ${mongoURI}: ${error.message}`);
    }
  }

  console.error("MongoDB connection failed for all configured URIs.");
  throw lastError || new Error("MongoDB connection failed.");
};

export default connectDB;
