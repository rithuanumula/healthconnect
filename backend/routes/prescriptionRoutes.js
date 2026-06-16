const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPatientPrescriptions,
  toggleMedicationStatus
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/patient/:patientId', protect, getPatientPrescriptions);
router.put('/:id/medication/:medIndex', protect, toggleMedicationStatus);

module.exports = router;
