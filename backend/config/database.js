import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/autosphere`);
    console.log(`Database connected : ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Database disconnected : ${error.message}`);
    process.exit(1);
    process.exit(1);
  }
};
