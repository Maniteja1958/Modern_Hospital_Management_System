const express = require('express');
const router = express.Router();
const { getMyPrescriptions, bookAppointment, getMyAppointments } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { extractPrescriptionText } = require('../controllers/uploadController');

router.use(protect);
router.use(authorize('Patient', 'Admin')); // Admin can optionally view their data

router.route('/prescriptions').get(getMyPrescriptions);
router.route('/appointments').post(bookAppointment).get(getMyAppointments);
router.route('/upload-prescription').post(upload.single('image'), extractPrescriptionText);

module.exports = router;
