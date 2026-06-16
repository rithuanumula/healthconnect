const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medication name is required']
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required (e.g. 650mg, 1 tablet)']
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required (e.g. 1-0-1, Once daily)']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required (e.g. 5 days, 1 month)']
  },
  instruction: {
    type: String,
    default: 'After food',
    enum: ['After food', 'Before food', 'With food', 'Empty stomach', 'As needed']
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
});

const PrescriptionSchema = new mongoose.Schema({
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required']
  },
  medications: [MedicationSchema]
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
