const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Override DNS servers to resolve MongoDB SRV lookup issues in Node
dns.setServers(['8.8.8.8']);

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const MedicalRecord = require('./models/MedicalRecord');
const Prescription = require('./models/Prescription');
const FollowUp = require('./models/FollowUp');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
  try {
    // Clear Database
    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Prescription.deleteMany();
    await FollowUp.deleteMany();

    console.log('Database cleared...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'HealthConnect Admin',
      email: 'admin@healthconnect.in',
      password: 'password123',
      role: 'admin',
      phone: '9876543210',
      gender: 'Male',
      age: 35
    });
    console.log('Admin seeded...');

    // 2. Create Doctors
    const docUser1 = await User.create({
      name: 'Dr. Arvind Sharma',
      email: 'arvind.sharma@healthconnect.in',
      password: 'password123',
      role: 'doctor',
      phone: '9812345678',
      gender: 'Male',
      age: 45
    });

    const docUser2 = await User.create({
      name: 'Dr. Priya Nair',
      email: 'priya.nair@healthconnect.in',
      password: 'password123',
      role: 'doctor',
      phone: '9823456789',
      gender: 'Female',
      age: 38
    });

    // Doctor details (Approved and Pending)
    const doctor1 = await Doctor.create({
      userId: docUser1._id,
      specialization: 'Cardiologist',
      experience: 15,
      qualification: 'MBBS, MD (Cardiology)',
      clinicName: 'Heart & Vascular Care Clinic',
      clinicAddress: '102, Sunrise Towers, Bandra West',
      city: 'Mumbai',
      fees: 1000,
      bio: 'Dr. Arvind Sharma is a senior interventional cardiologist with over 15 years of experience treating complex heart conditions in Mumbai.',
      status: 'approved',
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      }
    });

    const doctor2 = await Doctor.create({
      userId: docUser2._id,
      specialization: 'Pediatrician',
      experience: 10,
      qualification: 'MBBS, DCH (Pediatrics)',
      clinicName: 'Little Angels Clinic',
      clinicAddress: '45, Outer Ring Road, Indiranagar',
      city: 'Bengaluru',
      fees: 700,
      bio: 'Dr. Priya Nair specializes in child development, immunizations, and general pediatric care in Bengaluru.',
      status: 'pending', // Pending admin approval to demonstrate admin features
      availability: {
        days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        slots: ['10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM']
      }
    });

    console.log('Doctors seeded...');

    // 3. Create Patient
    const patient = await User.create({
      name: 'Rohan Gupta',
      email: 'rohan.gupta@healthconnect.in',
      password: 'password123',
      role: 'patient',
      phone: '9834567890',
      gender: 'Male',
      age: 28
    });
    console.log('Patient seeded...');

    console.log('Data Imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Prescription.deleteMany();
    await FollowUp.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
