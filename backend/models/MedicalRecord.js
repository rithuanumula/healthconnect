const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide record title (e.g. CBC Blood Test)'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Lab Report', 'Prescription', 'Scan', 'Discharge Summary', 'Other'],
    required: [true, 'Please specify category']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL or filename is required']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
