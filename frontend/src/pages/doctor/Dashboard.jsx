import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { AuthContext } from '../../context/AuthContext';
import { FaUserGroup, FaCalendarCheck, FaHourglassHalf, FaIndianRupeeSign, FaCalendarDays, FaUserClock } from 'react-icons/fa6';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    totalEarnings: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    const fetchDoctorDashboard = async () => {
      try {
        const res = await api.get('/appointments/doctor');
        const apps = res.data.data;

        // Today's date string
        const todayStr = new Date().toISOString().split('T')[0];

        const todayApps = apps.filter(a => a.date === todayStr && a.status === 'scheduled');
        setTodayAppointments(todayApps);

        // Calculate unique patients
        const uniquePatients = new Set(apps.map(a => a.patientId?._id));

        // Earnings from completed appointments
        const completedApps = apps.filter(a => a.status === 'completed');
        const earnings = completedApps.reduce((acc, current) => acc + current.fees, 0);

        const pendingAppsCount = apps.filter(a => a.status === 'scheduled').length;

        setStats({
          totalPatients: uniquePatients.size,
          totalAppointments: apps.length,
          pendingAppointments: pendingAppsCount,
          totalEarnings: earnings
        });
      } catch (err) {
        console.error('Error loading doctor stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDashboard();
  }, []);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar active={sidebarActive} toggleSidebar={toggleSidebar} />
        <div className="dashboard-content d-flex flex-column">
          <Navbar toggleSidebar={toggleSidebar} isDashboard={true} />
          <Loader message="Loading clinician metrics dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar active={sidebarActive} toggleSidebar={toggleSidebar} />
      
      <div className="dashboard-content d-flex flex-column p-0">
        <Navbar toggleSidebar={toggleSidebar} isDashboard={true} />
        
        <div className="p-4 flex-grow-1 fade-in-up">
          <div className="mb-4">
            <h2 className="fw-bold m-0 text-dark">Clinician Dashboard</h2>
            <p className="text-muted m-0">Welcome, {user.name}. Here are your clinic's patient summaries.</p>
          </div>

          {/* Stats Row */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Unique Patients</span>
                    <h3 className="fw-bold m-0 text-dark">{stats.totalPatients}</h3>
                  </div>
                  <div className="bg-primary-light text-teal p-3 rounded-3" style={{ color: '#0d9488', backgroundColor: '#f0fdfa' }}>
                    <FaUserGroup className="fs-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Total Consultations</span>
                    <h3 className="fw-bold m-0 text-dark">{stats.totalAppointments}</h3>
                  </div>
                  <div className="bg-info-subtle text-info p-3 rounded-3">
                    <FaCalendarCheck className="fs-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Pending Checkups</span>
                    <h3 className="fw-bold m-0 text-dark">{stats.pendingAppointments}</h3>
                  </div>
                  <div className="bg-warning-subtle text-warning p-3 rounded-3">
                    <FaHourglassHalf className="fs-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Revenue Earned</span>
                    <h3 className="fw-bold m-0 text-dark">₹{stats.totalEarnings}</h3>
                  </div>
                  <div className="bg-success-subtle text-success p-3 rounded-3">
                    <FaIndianRupeeSign className="fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Scheduled Appointments */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0 text-dark">Today's Scheduled Appointments</h5>
              <Link to="/doctor/appointments" className="text-teal text-decoration-none text-sm fw-semibold" style={{ color: '#0d9488' }}>
                Open Consult Room &rarr;
              </Link>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-3">
                <FaCalendarDays className="fs-1 text-muted mb-2" />
                <p className="text-muted m-0">No patient bookings scheduled for today.</p>
                <span className="text-xs text-muted">Check "Appointments" page to view upcoming dates.</span>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Patient Name</th>
                      <th>Time Slot</th>
                      <th>Phone</th>
                      <th>Gender / Age</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.map(app => (
                      <tr key={app._id}>
                        <td>
                          <div className="fw-bold">{app.patientId?.name}</div>
                          <div className="text-muted text-xs">{app.patientId?.email}</div>
                        </td>
                        <td>
                          <span className="badge bg-teal-subtle text-teal py-1.5 px-3 rounded" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                            {app.timeSlot}
                          </span>
                        </td>
                        <td>{app.patientId?.phone}</td>
                        <td>{app.patientId?.gender || 'N/A'} / {app.patientId?.age || 'N/A'} Yrs</td>
                        <td>
                          <Link
                            to="/doctor/appointments"
                            className="btn btn-teal btn-sm text-white px-3"
                            style={{ backgroundColor: '#0d9488', borderRadius: '6px' }}
                          >
                            Diagnose
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
