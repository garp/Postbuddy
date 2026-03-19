import mongoose from "mongoose";
import chalk from 'chalk';

export const connect = async () => {
  try {
    if (!process.env.MONGO_DB_URI) {
      console.error("Error: MONGO_DB_URI is not defined in environment variables.");
      process.exit(1);
    }
    const connection = await mongoose.connect(process.env.MONGO_DB_URI,{dbName:process.env.MONGO_DB_NAME});
    const coloredDB = chalk.hex('#A5158C')(process.env.MONGO_DB_NAME)
    console.log(`MongoDB connected successfully to database: ${coloredDB}`);
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
    process.exit(1);
  }
};
