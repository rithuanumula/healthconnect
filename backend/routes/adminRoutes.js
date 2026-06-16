const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getUsers,
  getAdminDoctors,
  verifyDoctor,
  getAdminAppointments
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply admin protection to all routes in this file
router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.get('/doctors', getAdminDoctors);
router.put('/doctors/:id/verify', verifyDoctor);
router.get('/appointments', getAdminAppointments);

module.exports = router;
