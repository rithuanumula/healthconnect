const express = require('express');
const router = express.Router();
const {
  scheduleFollowUp,
  getPatientFollowUps,
  getDoctorFollowUps,
  updateFollowUpStatus
} = require('../controllers/followUpController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('doctor'), scheduleFollowUp);
router.get('/patient', protect, authorize('patient'), getPatientFollowUps);
router.get('/doctor', protect, authorize('doctor'), getDoctorFollowUps);
router.put('/:id/status', protect, updateFollowUpStatus);

module.exports = router;
