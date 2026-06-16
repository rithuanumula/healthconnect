import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserDoctor, FaLocationDot, FaIndianRupeeSign, FaSuitcaseMedical, FaClock, FaCalendarDays } from 'react-icons/fa6';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import api from '../../utils/api';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Set default booking date to tomorrow (as patients book ahead)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        if (res.data.success) {
          setDoctor(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setToast({ message: 'Error loading doctor profile', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      setToast({ message: 'Please log in to book an appointment', type: 'error' });
      return;
    }

    if (user.role !== 'patient') {
      setToast({ message: 'Only patients can book appointments', type: 'error' });
      return;
    }

    if (!selectedSlot) {
      setToast({ message: 'Please select a time slot', type: 'error' });
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/appointments', {
        doctorId: doctor._id,
        date: bookingDate,
        timeSlot: selectedSlot,
        notes
      });

      if (res.data.success) {
        setToast({ message: 'Appointment booked successfully!', type: 'success' });
        setTimeout(() => {
          navigate('/my-appointments');
        }, 1500);
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Double booking error. Try another slot or date.',
        type: 'error'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Loader message="Loading doctor profile..." />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div>
        <Navbar />
        <div className="container py-5 text-center">
          <h3>Doctor profile not found</h3>
          <Link to="/doctors" className="btn btn-teal text-white mt-3" style={{ backgroundColor: '#0d9488' }}>
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container py-5">
        <div className="row g-4">
          
          {/* Doctor Info Card */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white fade-in-up">
              <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-4 mb-4">
                <div
                  className="bg-teal-subtle text-teal rounded-circle d-flex align-items-center justify-content-center fw-bold fs-1"
                  style={{ width: '100px', height: '100px', backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488', flexShrink: 0 }}
                >
                  {doctor.userId?.profilePic ? (
                    <img
                      src={doctor.userId.profilePic}
                      alt="Doctor Profile"
                      className="rounded-circle w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    doctor.userId?.name?.charAt(0) || 'D'
                  )}
                </div>
                <div className="text-center text-sm-start">
                  <h2 className="fw-bold text-dark m-0">{doctor.userId?.name}</h2>
                  <span className="badge bg-teal text-white px-3 py-2 fs-6 rounded-pill mt-2" style={{ backgroundColor: '#0d9488' }}>
                    {doctor.specialization}
                  </span>
                  <p className="text-muted mt-3 mb-1 d-flex align-items-center justify-content-center justify-content-sm-start gap-2">
                    <FaSuitcaseMedical /> {doctor.qualification} ({doctor.experience} Yrs Exp)
                  </p>
                  <p className="text-muted d-flex align-items-center justify-content-center justify-content-sm-start gap-2">
                    <FaLocationDot /> {doctor.clinicName}, {doctor.city}
                  </p>
                </div>
              </div>

              <div className="border-top pt-4">
                <h5 className="fw-bold mb-3">About Dr. {doctor.userId?.name.split(' ')[1]}</h5>
                <p className="text-muted" style={{ lineHeight: 1.6 }}>
                  {doctor.bio || "No biography provided. Certified medical consultant working for patient health enhancement."}
                </p>
              </div>

              <div className="border-top pt-4 mt-4">
                <h5 className="fw-bold mb-3">Clinic & Location</h5>
                <div className="p-3 bg-light rounded-3">
                  <p className="fw-bold text-dark mb-1">{doctor.clinicName}</p>
                  <p className="text-muted text-sm mb-0">{doctor.clinicAddress}</p>
                  <p className="text-muted text-sm mb-0">City: {doctor.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white sticky-top fade-in-up" style={{ top: '100px', zIndex: 10 }}>
              <h4 className="fw-bold mb-3 text-dark">Book Consultation</h4>
              <p className="fw-bold text-teal d-flex align-items-center gap-1 mb-4" style={{ color: '#0d9488', fontSize: '1.25rem' }}>
                <FaIndianRupeeSign /> {doctor.fees} <span className="text-muted fw-normal text-xs">per session</span>
              </p>

              {user ? (
                user.role === 'patient' ? (
                  <form onSubmit={handleBooking}>
                    
                    {/* Calendar Date Picker */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-muted d-flex align-items-center gap-2">
                        <FaCalendarDays /> Select Date
                      </label>
                      <input
                        type="date"
                        className="form-control custom-form-control"
                        required
                        value={bookingDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setBookingDate(e.target.value);
                          setSelectedSlot('');
                        }}
                      />
                    </div>

                    {/* Interactive Availability Time Slots */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-muted d-flex align-items-center gap-2">
                        <FaClock /> Available Slots
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {doctor.availability?.slots && doctor.availability.slots.length > 0 ? (
                          doctor.availability.slots.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              {slot}
                            </button>
                          ))
                        ) : (
                          <p className="text-muted text-sm">No slots available for this doctor.</p>
                        )}
                      </div>
                    </div>

                    {/* Booking Notes */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-muted">Consultation Notes (Optional)</label>
                      <textarea
                        className="form-control custom-form-control"
                        rows="3"
                        placeholder="e.g. Back pain for past 2 days, requesting checkup"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="btn btn-teal text-white w-100 py-3 fw-bold shadow-sm"
                      style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}
                    >
                      {bookingLoading ? 'Confirming appointment...' : 'Confirm Appointment Booking'}
                    </button>
                  </form>
                ) : (
                  <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-3 text-center">
                    <p className="mb-0 fw-medium">
                      You are logged in as a <strong>{user.role}</strong>. Please log in as a patient to book consultations.
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-3 border border-dashed rounded-3">
                  <p className="text-muted mb-3">Log in as a Patient to schedule appointment slots.</p>
                  <Link to="/login" className="btn btn-teal text-white px-4" style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}>
                    Login to Book
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
