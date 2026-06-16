const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, notes } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Please provide doctor ID, date, and time slot' });
    }

    // Verify doctor exists and is approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Doctor not found or not approved' });
    }

    // Verify timeslot availability
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked for the selected date'
      });
    }

    // Book appointment (copies doctor's fees)
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      timeSlot,
      fees: doctor.fees,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient appointments
// @route   GET /api/appointments/patient
// @access  Private (Patient only)
exports.getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone profilePic' }
      })
      .sort({ date: -1, timeSlot: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor
// @access  Private (Doctor only)
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email phone gender age profilePic')
      .sort({ date: -1, timeSlot: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (scheduled -> completed/cancelled)
// @route   PUT /api/appointments/:id/status
// @access  Private (Patient, Doctor, Admin)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Role checks
    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to change this appointment status' });
    }

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to change this appointment status' });
      }
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/appointments/:id/payment
// @access  Private (Patient or Admin)
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    if (!['pending', 'paid'].includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Only patient who booked or admin can pay/update payment
    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to perform this action' });
    }

    appointment.paymentStatus = paymentStatus;
    await appointment.save();

    res.json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};
