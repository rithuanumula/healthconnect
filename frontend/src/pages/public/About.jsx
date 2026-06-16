import React from 'react';
import Navbar from '../../components/Navbar';
import { FaHeartPulse, FaShield, FaUsers } from 'react-icons/fa6';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5 fade-in-up">
          <h1 className="fw-bold display-5" style={{ color: '#0f172a' }}>About HealthConnect</h1>
          <p className="lead text-muted max-w-2xl mx-auto">
            A secure digital healthcare locker and consultation platform designed for Indian patients and doctors.
          </p>
        </div>

        <div className="row align-items-center mb-5 py-4">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800"
              alt="Medical Consultation Team"
              className="img-fluid rounded-4 shadow"
              style={{ maxHeight: '380px', width: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="col-lg-6">
            <h3 className="fw-bold mb-3">Empowering Patients Digitally</h3>
            <p className="text-muted" style={{ lineHeight: 1.7 }}>
              HealthConnect represents a paradigm shift in healthcare record retention. By utilizing a chronological **Health Timeline**, patients can easily store all lab records, scans, and doctor prescriptions in one central repository.
            </p>
            <p className="text-muted" style={{ lineHeight: 1.7 }}>
              This reduces clinical overheads and ensures doctors have immediate, authenticated access to historical health metrics when checking in during follow-up appointments.
            </p>
          </div>
        </div>

        <div className="row g-4 text-center mt-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
              <div className="d-inline-flex p-3 bg-teal-subtle text-teal rounded-circle mx-auto mb-3" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                <FaShield className="fs-3" />
              </div>
              <h5 className="fw-bold">100% Secure Locker</h5>
              <p className="text-muted text-sm">Protected uploads utilizing JWT authorizations ensuring client data privacy compliance.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
              <div className="d-inline-flex p-3 bg-teal-subtle text-teal rounded-circle mx-auto mb-3" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                <FaHeartPulse className="fs-3" />
              </div>
              <h5 className="fw-bold">Follow-Up Reminders</h5>
              <p className="text-muted text-sm">Alerts and notification cues indicating upcoming consultations and tracker statuses.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
              <div className="d-inline-flex p-3 bg-teal-subtle text-teal rounded-circle mx-auto mb-3" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                <FaUsers className="fs-3" />
              </div>
              <h5 className="fw-bold">Verified Doctors Only</h5>
              <p className="text-muted text-sm">Every physician is vetted by the portal administrators before clinical slot reservations go active.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
