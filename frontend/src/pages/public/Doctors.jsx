import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserDoctor, FaLocationDot, FaIndianRupeeSign, FaSuitcaseMedical } from 'react-icons/fa6';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import api from '../../utils/api';

const specializations = [
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
];

const cities = [
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
];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let query = '?';
      if (specialization) query += `specialization=${specialization}&`;
      if (city) query += `city=${city}&`;
      if (search) query += `search=${search}&`;

      const res = await api.get(`/doctors${query}`);
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, city]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div>
      <Navbar />
      
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{ color: '#0f172a' }}>Book an Appointment</h1>
          <p className="text-muted">Find verified healthcare specialists in major Indian cities.</p>
        </div>

        {/* Filters and Search Bar */}
        <div className="card border-0 shadow-sm p-4 rounded-4 mb-5" style={{ background: '#f8fafc' }}>
          <form onSubmit={handleSearchSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-medium text-muted">Search Doctor Name</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control custom-form-control bg-white"
                  placeholder="e.g. Dr. Sharma"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-teal text-white px-3" type="submit" style={{ backgroundColor: '#0d9488' }}>
                  Search
                </button>
              </div>
            </div>
            
            <div className="col-md-4">
              <label className="form-label fw-medium text-muted">Specialization</label>
              <select
                className="form-select custom-form-control bg-white"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-medium text-muted">City</label>
              <select
                className="form-select custom-form-control bg-white"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map(ct => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <Loader message="Finding verified doctors..." />
        ) : doctors.length === 0 ? (
          <div className="text-center py-5">
            <FaUserDoctor className="fs-1 text-muted mb-3" />
            <h4 className="fw-bold">No doctors found matching filters</h4>
            <p className="text-muted">Try clearing search text or expanding your specialization criteria.</p>
            <button
              onClick={() => {
                setSearch('');
                setSpecialization('');
                setCity('');
              }}
              className="btn btn-teal text-white mt-2"
              style={{ backgroundColor: '#0d9488' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {doctors.map(doctor => (
              <div key={doctor._id} className="col-lg-4 col-md-6 fade-in-up">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 position-relative">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="bg-teal-subtle text-teal rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4"
                      style={{ width: '60px', height: '60px', backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}
                    >
                      {doctor.userId?.profilePic ? (
                        <img
                          src={doctor.userId.profilePic}
                          alt="Doctor"
                          className="rounded-circle w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        doctor.userId?.name ? doctor.userId.name.charAt(0) : 'D'
                      )}
                    </div>
                    <div>
                      <h5 className="fw-bold m-0 text-dark">{doctor.userId?.name}</h5>
                      <span className="text-teal fw-medium text-sm" style={{ color: '#0d9488' }}>
                        {doctor.specialization}
                      </span>
                    </div>
                  </div>

                  <div className="border-top pt-3 mt-2">
                    <p className="text-muted text-sm mb-2 d-flex align-items-center gap-2">
                      <FaSuitcaseMedical /> {doctor.qualification} ({doctor.experience} Yrs Exp)
                    </p>
                    <p className="text-muted text-sm mb-2 d-flex align-items-center gap-2">
                      <FaLocationDot /> {doctor.clinicName}, {doctor.city}
                    </p>
                    <p className="fw-bold text-dark mb-0 d-flex align-items-center gap-1">
                      <FaIndianRupeeSign /> {doctor.fees} <span className="text-muted fw-normal text-xs">consultation fee</span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link
                      to={`/doctors/${doctor._id}`}
                      className="btn btn-teal text-white w-100 py-2 fw-medium"
                      style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}
                    >
                      Book Consultation
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
