import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaHeartPulse,
  FaGauge,
  FaCalendarCheck,
  FaFileMedical,
  FaClock,
  FaUser,
  FaUserDoctor,
  FaUsers,
  FaClipboardList,
  FaRightFromBracket,
  FaBookMedical
} from 'react-icons/fa6';

const Sidebar = ({ active, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  const renderLinks = () => {
    switch (user.role) {
      case 'patient':
        return (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaGauge /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/doctors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaUserDoctor /> <span>Find Doctors</span>
            </NavLink>
            <NavLink to="/my-appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaCalendarCheck /> <span>My Appointments</span>
            </NavLink>
            <NavLink to="/medical-records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaFileMedical /> <span>Medical Records</span>
            </NavLink>
            <NavLink to="/prescriptions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaBookMedical /> <span>Prescriptions</span>
            </NavLink>
            <NavLink to="/follow-ups" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaClock /> <span>Follow-Ups</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaUser /> <span>Profile Settings</span>
            </NavLink>
          </>
        );
      case 'doctor':
        return (
          <>
            <NavLink to="/doctor" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end onClick={toggleSidebar}>
              <FaGauge /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/doctor/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaCalendarCheck /> <span>Appointments</span>
            </NavLink>
            <NavLink to="/doctor/patients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaUsers /> <span>My Patients</span>
            </NavLink>
            <NavLink to="/doctor/availability" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaClock /> <span>Availability</span>
            </NavLink>
          </>
        );
      case 'admin':
        return (
          <>
            <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end onClick={toggleSidebar}>
              <FaGauge /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaUsers /> <span>Manage Users</span>
            </NavLink>
            <NavLink to="/admin/doctors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaUserDoctor /> <span>Verify Doctors</span>
            </NavLink>
            <NavLink to="/admin/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
              <FaClipboardList /> <span>Appointments</span>
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`dashboard-sidebar ${active ? 'active' : ''}`}>
      <div className="p-4 d-flex align-items-center gap-3 border-bottom border-secondary-subtle">
        <FaHeartPulse className="fs-3 text-teal" style={{ color: '#0d9488' }} />
        <h4 className="m-0 fw-bold tracking-tight text-white fs-5">HealthConnect</h4>
      </div>

      <div className="py-4 d-flex flex-column justify-content-between" style={{ height: 'calc(100vh - 90px)' }}>
        <nav className="d-flex flex-column gap-1">
          {renderLinks()}
        </nav>

        <div className="px-3 border-top border-secondary-subtle pt-3">
          <div className="d-flex align-items-center gap-3 px-3 py-2 mb-3">
            <div
              className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle fw-bold"
              style={{ width: '40px', height: '40px', backgroundColor: '#0d9488' }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden" style={{ maxWidth: '140px' }}>
              <h6 className="m-0 text-white text-truncate text-sm">{user.name}</h6>
              <span className="text-muted text-capitalize text-xs d-block">{user.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ borderRadius: '8px' }}
          >
            <FaRightFromBracket /> <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
