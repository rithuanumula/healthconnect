const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  updateAvailability
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);

module.exports = router;
