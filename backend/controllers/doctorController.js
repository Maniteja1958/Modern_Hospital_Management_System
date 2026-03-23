const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// @desc    Get appointments for the logged-in doctor
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'firstName lastName email phoneNumber')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new digital prescription
// @route   POST /api/doctor/prescriptions
// @access  Private/Doctor
const createPrescription = async (req, res) => {
  try {
    const { patientId, medicines } = req.body;

    const prescription = await Prescription.create({
      doctor: req.user._id,
      patient: patientId,
      medicines,
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (Accept/Reject)
// @route   PUT /api/doctor/appointments/:id
// @access  Private/Doctor
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    // Ensure the doctor owns this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this appointment' });
    }
    
    appointment.status = status;
    await appointment.save();
    
    res.json(appointment);
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctorAppointments,
  createPrescription,
  updateAppointmentStatus
};
