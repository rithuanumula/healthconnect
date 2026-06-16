import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaHeartPulse } from 'react-icons/fa6';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';

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

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  // Doctor Fields
  const [specialization, setSpecialization] = useState(specializations[0]);
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [city, setCity] = useState(cities[0]);
  const [fees, setFees] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify phone length/regex
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setToast({ message: 'Please enter a valid 10-digit Indian phone number starting with 6-9', type: 'error' });
      return;
    }

    const payload = {
      role,
      name,
      email,
      password,
      phone,
      gender,
      age: age ? parseInt(age) : undefined
    };

    if (role === 'doctor') {
      payload.specialization = specialization;
      payload.experience = experience ? parseInt(experience) : 0;
      payload.qualification = qualification;
      payload.clinicName = clinicName;
      payload.clinicAddress = clinicAddress;
      payload.city = city;
      payload.fees = fees ? parseInt(fees) : 0;
      payload.bio = bio;
    }

    setLoading(true);
    const result = await register(payload);

    if (result.success) {
      setToast({
        message: role === 'doctor'
          ? 'Registration successful! Your profile is pending verification by the admin.'
          : 'Registration successful!',
        type: 'success'
      });
      setTimeout(() => {
        if (role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } else {
      setToast({ message: result.message, type: 'error' });
      setLoading(false);
    }
  };

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

      <div className="container py-5 d-flex justify-content-center align-items-center">
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white fade-in-up" style={{ width: '100%', maxWidth: '640px' }}>
          
          <div className="text-center mb-4">
            <FaHeartPulse className="fs-1 text-teal mb-2" style={{ color: '#0d9488' }} />
            <h3 className="fw-bold text-dark">Create Your Account</h3>
            <p className="text-muted text-sm">Join HealthConnect to store medical reports and book slots</p>
          </div>

          {/* Role selector tab */}
          <div className="btn-group w-100 mb-4" role="group">
            <button
              type="button"
              className={`btn py-2.5 fw-semibold ${role === 'patient' ? 'btn-teal text-white' : 'btn-light text-muted'}`}
              onClick={() => setRole('patient')}
              style={role === 'patient' ? { backgroundColor: '#0d9488' } : {}}
            >
              Patient Account
            </button>
            <button
              type="button"
              className={`btn py-2.5 fw-semibold ${role === 'doctor' ? 'btn-teal text-white' : 'btn-light text-muted'}`}
              onClick={() => setRole('doctor')}
              style={role === 'doctor' ? { backgroundColor: '#0d9488' } : {}}
            >
              Healthcare Professional (Doctor)
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <h5 className="fw-bold mb-3 border-bottom pb-2 text-secondary text-sm">Base Profile Details</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted text-sm fw-medium">Full Name</label>
                <input
                  type="text"
                  className="form-control custom-form-control"
                  required
                  placeholder="e.g. Rohan Gupta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted text-sm fw-medium">Email Address</label>
                <input
                  type="email"
                  className="form-control custom-form-control"
                  required
                  placeholder="e.g. rohan.gupta@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted text-sm fw-medium">Password</label>
                <input
                  type="password"
                  className="form-control custom-form-control"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted text-sm fw-medium">Indian Phone Number</label>
                <input
                  type="tel"
                  className="form-control custom-form-control"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted text-sm fw-medium">Gender</label>
                <select
                  className="form-select custom-form-control"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted text-sm fw-medium">Age</label>
                <input
                  type="number"
                  className="form-control custom-form-control"
                  placeholder="e.g. 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            {/* Doctor Fields */}
            {role === 'doctor' && (
              <div className="fade-in-up mt-4 pt-3">
                <h5 className="fw-bold mb-3 border-bottom pb-2 text-secondary text-sm">Professional Medical Details</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted text-sm fw-medium">Specialization</label>
                    <select
                      className="form-select custom-form-control"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                    >
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted text-sm fw-medium">Experience (Years)</label>
                    <input
                      type="number"
                      className="form-control custom-form-control"
                      required
                      placeholder="e.g. 12"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted text-sm fw-medium">Medical Qualifications</label>
                    <input
                      type="text"
                      className="form-control custom-form-control"
                      required
                      placeholder="e.g. MBBS, MD (Internal Medicine)"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted text-sm fw-medium">Consultation Fees (INR, ₹)</label>
                    <input
                      type="number"
                      className="form-control custom-form-control"
                      required
                      placeholder="e.g. 600"
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted text-sm fw-medium">Clinic Name</label>
                    <input
                      type="text"
                      className="form-control custom-form-control"
                      required
                      placeholder="e.g. Care Plus Clinic"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted text-sm fw-medium">City</label>
                    <select
                      className="form-select custom-form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {cities.map(ct => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted text-sm fw-medium">Clinic Full Address</label>
                    <input
                      type="text"
                      className="form-control custom-form-control"
                      required
                      placeholder="e.g. Flat 3A, Metro Plaza, MG Road"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted text-sm fw-medium">Short Bio / Achievements</label>
                    <textarea
                      className="form-control custom-form-control"
                      rows="2"
                      placeholder="Share your experience and special achievements..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-teal text-white w-100 py-3 fw-bold shadow-sm mt-4"
              style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}
            >
              {loading ? 'Creating account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-muted text-sm">Already have an account? </span>
            <Link to="/login" className="text-teal fw-medium text-decoration-none" style={{ color: '#0d9488' }}>
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
