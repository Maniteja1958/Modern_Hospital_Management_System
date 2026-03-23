const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// @desc    Get system statistics
// @route   GET /api/admin/stats for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'Patient' });
    const totalDoctors = await User.countDocuments({ role: 'Doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const totalPrescriptions = await Prescription.countDocuments();

    res.json({
      patients: totalPatients,
      doctors: totalDoctors,
      appointments: totalAppointments,
      prescriptions: totalPrescriptions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activity (e.g. latest prescriptions)
// @route   GET /api/admin/recent-activity
// @access  Private/Admin
const getRecentActivity = async (req, res) => {
  try {
    const recentPrescriptions = await Prescription.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('doctor', 'firstName lastName')
      .populate('patient', 'firstName lastName');

    const formattedActivity = recentPrescriptions.map((px) => ({
      id: px._id.toString().substring(0, 8).toUpperCase(), // Short ID
      date: new Date(px.createdAt).toLocaleDateString(),
      type: 'Prescription',
      doctor: `Dr. ${px.doctor?.lastName}`,
      patient: px.patient ? `${px.patient.firstName} ${px.patient.lastName}` : 'Unknown',
      status: px.status,
    }));

    res.json(formattedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSystemStats,
  getRecentActivity
};
