const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Upload a new medical record
// @route   POST /api/medical-records/upload
// @access  Private (Patient only)
exports.uploadRecord = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title and category' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a medical report file' });
    }

    // Standard local file URL path or file name. We will save the filename.
    const fileUrl = `/uploads/${req.file.filename}`;

    const record = await MedicalRecord.create({
      patientId: req.user.id,
      title,
      category,
      fileUrl,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Medical report uploaded successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient medical records (Health Timeline)
// @route   GET /api/medical-records/patient/:patientId
// @access  Private (Patient themselves or their Doctor, or Admin)
exports.getPatientRecords = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Check if patient themselves
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these records' });
    }

    // Check if doctor has had an appointment with this patient
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }

      const hasAppointment = await Appointment.findOne({
        patientId,
        doctorId: doctor._id
      });

      if (!hasAppointment) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this patient\'s medical records. Must have an appointment first.'
        });
      }
    }

    // Get records in chronological order
    const records = await MedicalRecord.find({ patientId })
      .sort({ uploadDate: -1 });

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a medical record
// @route   DELETE /api/medical-records/:id
// @access  Private (Patient only)
exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }

    // Verify ownership
    if (record.patientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this record' });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
