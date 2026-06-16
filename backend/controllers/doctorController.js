const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all approved doctors with optional filters
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    const { specialization, city, search } = req.query;
    
    // Base query: only show approved doctors
    const query = { status: 'approved' };

    if (specialization) {
      query.specialization = specialization;
    }

    if (city) {
      query.city = city;
    }

    let doctorIds = [];
    let nameFilterActive = false;

    // If search term is present, search by doctor name
    if (search) {
      nameFilterActive = true;
      const users = await User.find({
        role: 'doctor',
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      
      doctorIds = users.map(u => u._id);
    }

    if (nameFilterActive) {
      query.userId = { $in: doctorIds };
    }

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email phone gender age profilePic')
      .sort({ experience: -1 });

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'userId',
      'name email phone gender age profilePic'
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
exports.updateDoctorProfile = async (req, res, next) => {
  try {
    // Find doctor profile for this user
    let doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const fieldsToUpdate = {
      specialization: req.body.specialization,
      experience: req.body.experience,
      qualification: req.body.qualification,
      clinicName: req.body.clinicName,
      clinicAddress: req.body.clinicAddress,
      city: req.body.city,
      fees: req.body.fees,
      bio: req.body.bio
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone gender age profilePic');

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/availability
// @access  Private (Doctor only)
exports.updateAvailability = async (req, res, next) => {
  try {
    const { days, slots } = req.body;

    if (!days || !slots) {
      return res.status(400).json({ success: false, message: 'Please provide days and slots' });
    }

    let doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    doctor.availability = { days, slots };
    await doctor.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};
