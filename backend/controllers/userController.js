const User = require('../models/User');

// @desc    Get all patients
// @route   GET /api/users/patients
// @access  Private/Doctor/Admin
const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Private/Patient/Admin
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all system users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPatients, getDoctors, getAllUsers };
