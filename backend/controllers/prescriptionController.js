const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
exports.createPrescription = async (req, res, next) => {
  try {
    const { patientId, appointmentId, diagnosis, medications } = req.body;

    if (!patientId || !appointmentId || !diagnosis || !medications || medications.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all details: patientId, appointmentId, diagnosis, medications' });
    }

    // Verify doctor exists and has doctor profile
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Verify appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(404).json({ success: false, message: 'Appointment not found or not matched with doctor' });
    }

    // Create prescription
    const prescription = await Prescription.create({
      patientId,
      doctorId: doctor._id,
      appointmentId,
      diagnosis,
      medications
    });

    // Automatically mark the appointment as completed
    appointment.status = 'completed';
    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Prescription created and appointment completed',
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient prescriptions
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private (Patient themselves or Doctor, or Admin)
exports.getPatientPrescriptions = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Check authorization
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these prescriptions' });
    }

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
          message: 'Not authorized to access this patient\'s prescriptions'
        });
      }
    }

    const prescriptions = await Prescription.find({ patientId })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone profilePic' }
      })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle medication completion status (active / completed)
// @route   PUT /api/prescriptions/:id/medication/:medIndex
// @access  Private (Patient themselves or Doctor)
exports.toggleMedicationStatus = async (req, res, next) => {
  try {
    const { id, medIndex } = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Role verification
    if (req.user.role === 'patient' && prescription.patientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor || prescription.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    if (!prescription.medications[medIndex]) {
      return res.status(404).json({ success: false, message: 'Medication index not found' });
    }

    // Toggle status
    const currentStatus = prescription.medications[medIndex].status;
    prescription.medications[medIndex].status = currentStatus === 'active' ? 'completed' : 'active';

    await prescription.save();

    res.json({
      success: true,
      message: `Medication status updated to ${prescription.medications[medIndex].status}`,
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};
