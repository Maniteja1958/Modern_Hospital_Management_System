const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// Load env vars
dotenv.config();

const clearData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB...');
    
    // Wipe all collections
    await User.deleteMany();
    await Appointment.deleteMany();
    await Prescription.deleteMany();

    console.log('✅ ALL Database Data Successfully Wiped!');
    process.exit();
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearData();
