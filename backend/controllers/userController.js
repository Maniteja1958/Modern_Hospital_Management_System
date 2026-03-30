const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const Prescription = require('../models/Prescription');

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

// @desc    Get notifications for current user
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    let notifications = [];

    // Messages (all roles can receive messages)
    const messages = await Message.find({ receiver: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('sender', 'firstName lastName');
    
    messages.forEach(msg => {
      notifications.push({
        id: msg._id,
        type: 'message',
        title: `New Message`,
        message: `${msg.sender.firstName} ${msg.sender.lastName}: ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`,
        date: msg.createdAt
      });
    });

    if (role === 'Patient') {
      const appointments = await Appointment.find({ patient: userId, status: { $ne: 'Pending' } })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('doctor', 'firstName lastName');
      
      appointments.forEach(apt => {
        notifications.push({
          id: apt._id,
          type: 'appointment',
          title: `Appointment ${apt.status}`,
          message: `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName} marked your appointment as ${apt.status}.`,
          date: apt.updatedAt
        });
      });

      const prescriptions = await Prescription.find({ patient: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('doctor', 'firstName lastName');

      prescriptions.forEach(rx => {
        notifications.push({
          id: rx._id,
          type: 'prescription',
          title: 'New Prescription',
          message: `Dr. ${rx.doctor.firstName} ${rx.doctor.lastName} prescribed ${rx.medicines.length} med(s).`,
          date: rx.createdAt
        });
      });
    }

    if (role === 'Doctor') {
      const appointments = await Appointment.find({ doctor: userId, status: 'Pending' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('patient', 'firstName lastName');
      
      appointments.forEach(apt => {
        notifications.push({
          id: apt._id,
          type: 'appointment',
          title: 'Appointment Request',
          message: `${apt.patient.firstName} ${apt.patient.lastName} requested an appointment.`,
          date: apt.createdAt
        });
      });
    }

    if (role === 'Admin') {
      const newDoctors = await User.find({ role: 'Doctor' }).sort({ createdAt: -1 }).limit(5);
      newDoctors.forEach(doc => {
        notifications.push({
          id: doc._id,
          type: 'system',
          title: 'New Register',
          message: `Dr. ${doc.firstName} ${doc.lastName} joined the platform.`,
          date: doc.createdAt
        });
      });
    }

    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(notifications.slice(0, 10));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPatients, getDoctors, getAllUsers, getNotifications };
