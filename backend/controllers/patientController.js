const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

// @desc    Get prescriptions for the logged-in patient
// @route   GET /api/patient/prescriptions
// @access  Private/Patient
const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book a new appointment
// @route   POST /api/patient/appointments
// @access  Private/Patient
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reasonForVisit } = req.body;
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reasonForVisit,
      status: 'Pending'
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments for the logged-in patient
// @route   GET /api/patient/appointments
// @access  Private/Patient
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'firstName lastName')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyPrescriptions,
  bookAppointment,
  getMyAppointments
};
