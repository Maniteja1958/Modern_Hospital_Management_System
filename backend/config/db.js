const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Support standard MONGO_URI and Railway's default MONGO_URL injects
    const URI = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/smarthospital';
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
