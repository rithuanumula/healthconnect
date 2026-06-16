const mongoose = require('mongoose');

const FollowUpSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  originalAppointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  followUpDate: {
    type: String, // format YYYY-MM-DD
    required: [true, 'Please specify follow up date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please specify follow up time slot']
  },
  status: {
    type: String,
    enum: ['pending', 'notified', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FollowUp', FollowUpSchema);
