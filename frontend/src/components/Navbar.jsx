import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHeartPulse, FaBars } from 'react-icons/fa6';

const Navbar = ({ toggleSidebar, isDashboard = false }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isDashboard) {
    return (
      <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 sticky-top">
        <button className="btn btn-light d-lg-none me-3" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold text-muted text-capitalize">
            HealthConnect / {user?.role} Portal
          </span>
        </div>
        <div className="ms-auto d-flex align-items-center gap-3">
          <div className="text-end d-none d-sm-block">
            <span className="fw-medium d-block">{user?.name}</span>
            <span className="text-muted text-xs text-capitalize">{user?.role}</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <FaHeartPulse className="fs-3 text-teal" style={{ color: '#0d9488' }} />
          <span className="fw-bold fs-4 text-teal" style={{ color: '#0d9488' }}>HealthConnect</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-toggle="target"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'text-teal' : ''}`} to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'text-teal' : ''}`} to="/doctors">
                Find Doctors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-medium ${isActive ? 'text-teal' : ''}`} to="/about">
                About Us
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <Link
                  className="btn btn-outline-teal me-2"
                  to={
                    user.role === 'admin'
                      ? '/admin'
                      : user.role === 'doctor'
                      ? '/doctor'
                      : '/dashboard'
                  }
                  style={{ borderColor: '#0d9488', color: '#0d9488', borderRadius: '8px' }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="btn btn-outline-danger"
                  style={{ borderRadius: '8px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-teal me-2" to="/login" style={{ borderColor: '#0d9488', color: '#0d9488', borderRadius: '8px' }}>
                  Login
                </Link>
                <Link className="btn btn-teal text-white" to="/register" style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
