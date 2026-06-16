const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: [true, 'Please specify specialization'],
    enum: [
      'General Physician',
      'Cardiologist',
      'Pediatrician',
      'Gynecologist',
      'Orthopedician',
      'Dermatologist',
      'ENT Specialist',
      'Neurologist',
      'Ophthalmologist',
      'Dentist',
      'Psychiatrist'
    ]
  },
  experience: {
    type: Number,
    required: [true, 'Please specify experience in years'],
    min: [0, 'Experience cannot be negative']
  },
  qualification: {
    type: String,
    required: [true, 'Please specify qualification (e.g. MBBS, MD)']
  },
  clinicName: {
    type: String,
    required: [true, 'Please specify clinic name']
  },
  clinicAddress: {
    type: String,
    required: [true, 'Please specify clinic address']
  },
  city: {
    type: String,
    required: [true, 'Please specify city'],
    enum: [
      'Delhi',
      'Mumbai',
      'Bengaluru',
      'Chennai',
      'Kolkata',
      'Hyderabad',
      'Pune',
      'Ahmedabad',
      'Jaipur',
      'Lucknow',
      'Chandigarh'
    ]
  },
  fees: {
    type: Number,
    required: [true, 'Please specify consultation fees in INR'],
    min: [0, 'Fees cannot be negative']
  },
  bio: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  availability: {
    days: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    slots: {
      type: [String],
      default: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
