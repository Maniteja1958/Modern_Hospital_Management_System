const express = require('express');
const router = express.Router();
const { getSystemStats, getRecentActivity } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin')); // Strictly only Admin

router.route('/stats').get(getSystemStats);
router.route('/recent-activity').get(getRecentActivity);

module.exports = router;
