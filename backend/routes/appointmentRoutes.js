const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  updatePaymentStatus
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/patient', protect, authorize('patient'), getPatientAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;
