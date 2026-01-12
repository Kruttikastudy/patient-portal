const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI environment variable");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "emrdb"
    });

    console.log(
      `MongoDB Connected: ${conn.connection.host}, DB: ${conn.connection.name}`
    );
  } catch (error) {
    console.error(`Mongo connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
