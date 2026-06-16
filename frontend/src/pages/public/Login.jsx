import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaHeartPulse, FaEnvelope, FaLock } from 'react-icons/fa6';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: 'Please enter all fields', type: 'error' });
      return;
    }

    setLoading(true);
    const result = await login(email, password);

    if (result.success) {
      setToast({ message: 'Login successful!', type: 'success' });
      // Redirect based on role
      setTimeout(() => {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
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

      <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white fade-in-up" style={{ width: '100%', maxWidth: '420px' }}>
          
          <div className="text-center mb-4">
            <FaHeartPulse className="fs-1 text-teal mb-2" style={{ color: '#0d9488' }} />
            <h3 className="fw-bold text-dark">Welcome Back</h3>
            <p className="text-muted text-sm">Sign in to manage your medical history</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium text-muted">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="form-control custom-form-control border-start-0 ps-0"
                  required
                  placeholder="e.g. pat@healthconnect.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className="form-control custom-form-control border-start-0 ps-0"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-teal text-white w-100 py-3 fw-bold shadow-sm mb-3"
              style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="p-3 bg-light rounded-3 mb-3" style={{ fontSize: '0.85rem' }}>
            <span className="fw-bold d-block mb-1 text-muted">Quick Demo Login:</span>
            <div className="d-flex flex-column gap-1 text-xs">
              <div><strong>Admin:</strong> admin@healthconnect.in (pw: password123)</div>
              <div><strong>Doctor (Approved):</strong> arvind.sharma@healthconnect.in (pw: password123)</div>
              <div><strong>Patient:</strong> rohan.gupta@healthconnect.in (pw: password123)</div>
            </div>
          </div>

          <div className="text-center mt-3">
            <span className="text-muted text-sm">Don't have an account? </span>
            <Link to="/register" className="text-teal fw-medium text-decoration-none" style={{ color: '#0d9488' }}>
              Register Here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
