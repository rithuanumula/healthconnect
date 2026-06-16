import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartPulse, FaUserDoctor, FaCalendarCheck, FaFileInvoice } from 'react-icons/fa6';
import Navbar from '../../components/Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0 fade-in-up">
              <span className="badge bg-teal-subtle text-teal mb-3 px-3 py-2 fs-6 rounded-pill" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)', color: '#0d9488' }}>
                Your Complete Healthcare Journey
              </span>
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#0f172a', lineHeight: 1.15 }}>
                Manage Your Health Timeline & Book Top Indian Doctors
              </h1>
              <p className="lead text-muted mb-5">
                HealthConnect connects you to specialized doctors across major Indian cities, tracks your active medications, stores medical reports, and sends follow-up alerts.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/doctors" className="btn btn-teal btn-lg px-4 py-3 text-white fw-medium shadow-sm" style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}>
                  Find & Book a Doctor
                </Link>
                <Link to="/register" className="btn btn-outline-secondary btn-lg px-4 py-3 fw-medium" style={{ borderRadius: '8px' }}>
                  Join as Patient
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
                <div
                  className="rounded-4 shadow-lg overflow-hidden border border-white"
                  style={{ transform: 'rotate(-2deg)', background: '#fff', padding: '16px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                    alt="Healthcare Portal Dashboard Mockup"
                    className="img-fluid rounded-3"
                    style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                  />
                  <div className="pt-3">
                    <span className="text-muted text-xs">Digital Health Locker & Chronological Medical History Timeline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold fs-1" style={{ color: '#0f172a' }}>Why HealthConnect?</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Our comprehensive health tracking platform supports three interfaces built to keep patients connected to their doctors.
            </p>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
                <div className="d-inline-flex p-3 bg-teal-subtle text-teal rounded-circle mx-auto mb-4" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                  <FaUserDoctor className="fs-2" />
                </div>
                <h4 className="fw-bold mb-3">Specialist Search</h4>
                <p className="text-muted">
                  Search approved doctors by specialization (Cardiology, Pediatrics, Gynecology) across Delhi, Mumbai, Bengaluru, and Pune.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
                <div className="d-inline-flex p-3 bg-teal-subtle text-teal rounded-circle mx-auto mb-4" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                  <FaCalendarCheck className="fs-2" />
                </div>
                <h4 className="fw-bold mb-3">Online Booking</h4>
                <p className="text-muted">
                  Book appointment time-slots directly and receive automated follow-up alerts and prescription reminders on your dashboard.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
                <div className="d-inline-flex p-3 bg-teal-subtle text-teal rounded-circle mx-auto mb-4" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                  <FaFileInvoice className="fs-2" />
                </div>
                <h4 className="fw-bold mb-3">Chronological Health Timeline</h4>
                <p className="text-muted">
                  Upload medical scan reports, test findings, and diagnosis notes to build a private, sequential health history locker.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Indian Context banner */}
      <section className="py-5 text-white" style={{ backgroundColor: '#0f172a' }}>
        <div className="container py-4 text-center">
          <h3 className="fw-bold mb-3">Now Supporting Major Cities across India</h3>
          <p className="lead text-secondary mb-4">
            Consultations start at ₹500 with top verified medical specialists.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {['Delhi NCR', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'].map(city => (
              <span key={city} className="badge bg-secondary px-3 py-2 rounded-pill text-light" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-4 bg-light border-top">
        <div className="container text-center">
          <p className="m-0 text-muted">&copy; 2026 HealthConnect India. All Rights Reserved. Built for digital health record compliance.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
