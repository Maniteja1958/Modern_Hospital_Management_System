const express = require('express');
const router = express.Router();
const { getDoctorAppointments, createPrescription, updateAppointmentStatus } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Doctor', 'Admin')); // Admin can optionally view/override

router.route('/appointments').get(getDoctorAppointments);
router.route('/appointments/:id').put(updateAppointmentStatus);
router.route('/prescriptions').post(createPrescription);

module.exports = router;
