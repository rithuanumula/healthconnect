# HealthConnect - Complete MERN Stack Healthcare Management Locker

HealthConnect is a comprehensive digital healthcare management platform designed for the Indian healthcare context (built with Node.js, Express, MongoDB, and React with Bootstrap 5).

---

## Folder Structure Overview

```
healthconnect/
├── backend/            # Express, Mongoose schemas, controllers, and upload handlers
├── frontend/           # React dashboard UI (Vite template)
├── package.json        # Root coordination workspaces script
└── README.md           # Setup & execution instructions
```

---

## Features Implemented

1. **Auth & Identity**: Role-Based access for Patient, Doctor, and Admin. Custom JWT middleware and Bcrypt password encryption. Indian phone format checks (starting with 6-9).
2. **Dashboard views**: Detailed summary widgets and reminders tailored per role.
3. **Medical Record Locker & Chronological Timeline**: Secure local file uploads for medical reports (PDF/JPG/PNG) using `multer` with a sequential, visual timeline of patient history.
4. **Prescription Tracking**: Doctors write prescriptions and patients can toggle individual medication status (active/completed) with progress bars.
5. **Interactive Booking**: Reserve appointments by checking doctor availability slots and dates. Copied consulting fees (INR, ₹).
6. **Follow-Up Reminders**: Automated reminders scheduled by clinicians.
7. **Admin Control Desk**: Approve/verify registered doctors, manage platform bookings, and view system metrics (earnings, specializations, monthly charts using Chart.js).

---

## Configuration & Environment Variables

### 1. Backend Config
Rename or update the environment details in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthconnect
JWT_SECRET=healthconnect_jwt_secret_key_123456
NODE_ENV=development
```
*Note: Make sure your local MongoDB instance is started, or update the `MONGODB_URI` to your MongoDB Atlas connection string.*

---

## Setup & Running the Application

### Step 1: Install Dependencies
Open a command prompt in the project root directory and install all node modules:
```bash
npm run install-all
```
This single command installs the required modules for both backend and frontend.

### Step 2: Seed the Database
Pre-populate the database with test accounts (including one admin, two doctors, and a patient):
```bash
cd backend
node seeder.js
```
This inserts the following quick-test login accounts:
* **Admin Profile**: `admin@healthconnect.in` | password: `password123`
* **Cardiologist (Approved)**: `arvind.sharma@healthconnect.in` | password: `password123`
* **Pediatrician (Pending Verification)**: `priya.nair@healthconnect.in` | password: `password123`
* **Patient Profile**: `rohan.gupta@healthconnect.in` | password: `password123`

### Step 3: Run the Application
Start both the backend server and frontend dev server simultaneously by executing from the root directory:
```bash
npm run dev
```
* The backend API server will listen on `http://localhost:5000`
* The frontend React-Vite UI will run on `http://localhost:5173` (or the next available port)

---

## Verification Test Flows

1. **Verify Doctor Profile**:
   * Log in as Admin (`admin@healthconnect.in`).
   * Navigate to the **Verify Doctors** page.
   * Approve `Dr. Priya Nair`'s pending registration.
   * Check updated graphs on the Admin Dashboard.
2. **Book Appointment**:
   * Log in as Patient (`rohan.gupta@healthconnect.in`).
   * Search for doctors (filter by cardiologists or general physician).
   * Go to `Dr. Arvind Sharma`'s profile, pick a date and time slot, write consult notes, and click book.
3. **Simulate Consult & Prescribe**:
   * Log in as Doctor (`arvind.sharma@healthconnect.in`).
   * View upcoming bookings on the dashboard.
   * Start consultation: write a clinical diagnosis, add medications (names, dosage frequency e.g. 1-0-1), check the follow-up consult switch, and set a date. Click complete.
4. **Prescription Progress & Locker timeline**:
   * Log in back as Patient (`rohan.gupta@healthconnect.in`).
   * Go to **Prescriptions** to track your medication completion rates (toggle checkmarks to see progress updates).
   * Go to **Medical Records** and upload a lab PDF to check the chronological Health Timeline.
