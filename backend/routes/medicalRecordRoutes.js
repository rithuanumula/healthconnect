const express = require('express');
const router = express.Router();
const {
  uploadRecord,
  getPatientRecords,
  deleteRecord
} = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, authorize('patient'), upload.single('report'), uploadRecord);
router.get('/patient/:patientId', protect, getPatientRecords);
router.delete('/:id', protect, authorize('patient'), deleteRecord);

module.exports = router;
