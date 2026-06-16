const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for local testing, or specify frontend URL later
  credentials: true
}));

// Body parser
app.use(express.json());

// Set static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const auth = require('./routes/authRoutes');
const doctors = require('./routes/doctorRoutes');
const appointments = require('./routes/appointmentRoutes');
const medicalRecords = require('./routes/medicalRecordRoutes');
const prescriptions = require('./routes/prescriptionRoutes');
const followUps = require('./routes/followUpRoutes');
const admin = require('./routes/adminRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/doctors', doctors);
app.use('/api/appointments', appointments);
app.use('/api/medical-records', medicalRecords);
app.use('/api/prescriptions', prescriptions);
app.use('/api/follow-ups', followUps);
app.use('/api/admin', admin);

// Test endpoint
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'ok', message: 'HealthConnect Backend API is running successfully.' });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
