const express = require('express');
const router = express.Router();
const { getPatients, getDoctors, getAllUsers, getNotifications } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(authorize('Admin'), getAllUsers);
router.route('/patients').get(authorize('Doctor', 'Admin'), getPatients);
router.route('/doctors').get(authorize('Patient', 'Admin'), getDoctors);
router.route('/notifications').get(getNotifications);

module.exports = router;
