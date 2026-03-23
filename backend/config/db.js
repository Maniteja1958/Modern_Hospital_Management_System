const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We expect MONGO_URI in .env. We fallback to a local host db if not provided for dev ease.
    const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smarthospital';
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
