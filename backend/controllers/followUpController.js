const FollowUp = require('../models/FollowUp');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Schedule a new follow-up
// @route   POST /api/follow-ups
// @access  Private (Doctor only)
exports.scheduleFollowUp = async (req, res, next) => {
  try {
    const { patientId, originalAppointmentId, followUpDate, timeSlot, notes } = req.body;

    if (!patientId || !originalAppointmentId || !followUpDate || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Please provide all details: patientId, originalAppointmentId, followUpDate, timeSlot' });
    }

    // Verify doctor exists and has doctor profile
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Verify original appointment
    const appointment = await Appointment.findById(originalAppointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Original appointment not found' });
    }

    // Create follow-up record
    const followUp = await FollowUp.create({
      patientId,
      doctorId: doctor._id,
      originalAppointmentId,
      followUpDate,
      timeSlot,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Follow-up consultation scheduled successfully',
      data: followUp
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient follow-ups (Upcoming alerts & Reminders)
// @route   GET /api/follow-ups/patient
// @access  Private (Patient only)
exports.getPatientFollowUps = async (req, res, next) => {
  try {
    const followUps = await FollowUp.find({ patientId: req.user.id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone profilePic' }
      })
      .sort({ followUpDate: 1 });

    res.json({
      success: true,
      count: followUps.length,
      data: followUps
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor follow-ups
// @route   GET /api/follow-ups/doctor
// @access  Private (Doctor only)
exports.getDoctorFollowUps = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const followUps = await FollowUp.find({ doctorId: doctor._id })
      .populate('patientId', 'name email phone gender age profilePic')
      .sort({ followUpDate: 1 });

    res.json({
      success: true,
      count: followUps.length,
      data: followUps
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update follow-up status
// @route   PUT /api/follow-ups/:id/status
// @access  Private (Patient, Doctor, Admin)
exports.updateFollowUpStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'notified', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const followUp = await FollowUp.findById(req.params.id);

    if (!followUp) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && followUp.patientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor || followUp.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    followUp.status = status;
    await followUp.save();

    res.json({
      success: true,
      message: `Follow-up status updated to ${status}`,
      data: followUp
    });
  } catch (error) {
    next(error);
  }
};
