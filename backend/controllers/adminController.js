const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard analytics (Aggregations)
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res, next) => {
  try {
    // Total Counts
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();

    // Doctor verification counts
    const pendingDoctors = await Doctor.countDocuments({ status: 'pending' });
    const approvedDoctors = await Doctor.countDocuments({ status: 'approved' });

    // Financial Analytics (Revenue from completed appointments)
    const revenueAggregation = await Appointment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$fees' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Appointment Status distribution
    const appointmentStatusAggregation = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const appointmentStatus = {
      scheduled: 0,
      completed: 0,
      cancelled: 0
    };
    appointmentStatusAggregation.forEach(item => {
      if (appointmentStatus.hasOwnProperty(item._id)) {
        appointmentStatus[item._id] = item.count;
      }
    });

    // Specialization distribution for approved doctors
    const specializationAggregation = await Doctor.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$specialization', count: { $sum: 1 } } }
    ]);

    // Monthly Earnings for current calendar year
    const currentYear = new Date().getFullYear();
    const monthlyRevenueAggregation = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$fees' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Format monthly earnings array (index 0 corresponds to Jan, etc.)
    const monthlyRevenue = Array(12).fill(0);
    monthlyRevenueAggregation.forEach(item => {
      const monthIndex = item._id - 1; // 1-indexed to 0-indexed
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyRevenue[monthIndex] = item.revenue;
      }
    });

    res.json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalPatients,
          totalDoctors,
          totalAppointments,
          pendingDoctors,
          approvedDoctors
        },
        financials: {
          totalRevenue,
          monthlyRevenue
        },
        appointmentStatus,
        specializations: specializationAggregation
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all users (Patients, Doctors, Admin)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all doctors (with profiles and registration statuses)
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
exports.getAdminDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({})
      .populate('userId', 'name email phone gender age profilePic')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a doctor (Approve or Reject registration status)
// @route   PUT /api/admin/doctors/:id/verify
// @access  Private (Admin only)
exports.verifyDoctor = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    doctor.status = status;
    await doctor.save();

    res.json({
      success: true,
      message: `Doctor status updated to ${status} for Dr. ${doctor.userId.name}`,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all appointments in the system
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
exports.getAdminAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialization' }
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
