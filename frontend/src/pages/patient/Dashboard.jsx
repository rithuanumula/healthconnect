import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import {
  FaCalendarDays,
  FaFilePrescription,
  FaFileMedical,
  FaClock,
  FaBell,
  FaCheckDouble,
  FaCalendarCheck,
  FaAngleRight
} from 'react-icons/fa6';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appointmentsCount: 0,
    prescriptionsCount: 0,
    recordsCount: 0,
    followUpsCount: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [activeMedications, setActiveMedications] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch appointments
        const appRes = await api.get('/appointments/patient');
        const apps = appRes.data.data;
        const scheduledApps = apps.filter(a => a.status === 'scheduled');
        setUpcomingAppointments(scheduledApps.slice(0, 3));

        // Fetch prescriptions
        const prescRes = await api.get(`/prescriptions/patient/${user._id}`);
        const prescriptions = prescRes.data.data;

        // Extract active medications from all prescriptions
        const meds = [];
        prescriptions.forEach(p => {
          p.medications.forEach(m => {
            if (m.status === 'active') {
              meds.push({
                ...m,
                doctorName: p.doctorId?.userId?.name || 'Doctor',
                prescriptionId: p._id,
                date: p.date
              });
            }
          });
        });
        setActiveMedications(meds.slice(0, 4));

        // Fetch medical records
        const recRes = await api.get(`/medical-records/patient/${user._id}`);
        const records = recRes.data.data;

        // Fetch follow ups
        const fuRes = await api.get('/follow-ups/patient');
        const followUps = fuRes.data.data;
        const activeFollowUps = followUps.filter(f => f.status === 'pending');
        setUpcomingFollowUps(activeFollowUps.slice(0, 2));

        setStats({
          appointmentsCount: apps.length,
          prescriptionsCount: prescriptions.length,
          recordsCount: records.length,
          followUpsCount: activeFollowUps.length
        });
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user._id]);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar active={sidebarActive} toggleSidebar={toggleSidebar} />
        <div className="dashboard-content d-flex flex-column">
          <Navbar toggleSidebar={toggleSidebar} isDashboard={true} />
          <Loader message="Loading health summary dashboard..." />
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold m-0 text-dark">Hello, {user.name}</h2>
              <p className="text-muted m-0">Here is your Health Activity overview at a glance.</p>
            </div>
            {stats.followUpsCount > 0 && (
              <div className="alert alert-warning border-0 m-0 d-flex align-items-center gap-2 py-2 px-3 rounded-pill shadow-sm">
                <FaBell className="text-warning-emphasis" />
                <span className="text-xs fw-semibold text-warning-emphasis">
                  {stats.followUpsCount} Pending Follow-Ups
                </span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Total Bookings</span>
                    <h3 className="fw-bold m-0 text-dark">{stats.appointmentsCount}</h3>
                  </div>
                  <div className="bg-primary-light text-teal p-3 rounded-3" style={{ color: '#0d9488', backgroundColor: '#f0fdfa' }}>
                    <FaCalendarCheck className="fs-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Prescriptions</span>
                    <h3 className="fw-bold m-0 text-dark">{stats.prescriptionsCount}</h3>
                  </div>
                  <div className="bg-info-subtle text-info p-3 rounded-3">
                    <FaFilePrescription className="fs-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Health Records</span>
                    <h3 className="fw-bold m-0 text-dark">{stats.recordsCount}</h3>
                  </div>
                  <div className="bg-success-subtle text-success p-3 rounded-3">
                    <FaFileMedical className="fs-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Active Follow-ups</span>
                    <h3 className="fw-bold m-0 text-dark">{stats.followUpsCount}</h3>
                  </div>
                  <div className="bg-warning-subtle text-warning p-3 rounded-3">
                    <FaClock className="fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Column: Upcoming Appointments & Reminders */}
            <div className="col-lg-7">
              {/* Upcoming Appointments */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold m-0 text-dark">Upcoming Appointments</h5>
                  <Link to="/my-appointments" className="text-teal text-decoration-none text-sm fw-semibold d-flex align-items-center gap-1" style={{ color: '#0d9488' }}>
                    View All <FaAngleRight />
                  </Link>
                </div>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-4 bg-light rounded-3">
                    <FaCalendarDays className="fs-2 text-muted mb-2" />
                    <p className="text-muted m-0 text-sm">No scheduled appointments found.</p>
                    <Link to="/doctors" className="btn btn-teal text-white btn-sm mt-2" style={{ backgroundColor: '#0d9488' }}>
                      Book Consult Now
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {upcomingAppointments.map(app => (
                      <div key={app._id} className="p-3 bg-light rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                        <div>
                          <h6 className="fw-bold text-dark m-0">{app.doctorId?.userId?.name}</h6>
                          <span className="text-teal text-xs fw-medium d-block mb-1" style={{ color: '#0d9488' }}>
                            {app.doctorId?.specialization}
                          </span>
                          <span className="text-muted text-xs d-block">
                            Clinic: {app.doctorId?.clinicName}, {app.doctorId?.city}
                          </span>
                        </div>
                        <div className="text-sm-end">
                          <span className="badge bg-teal-subtle text-teal px-3 py-1.5 rounded-pill d-inline-block text-xs fw-semibold mb-1" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                            {app.date} | {app.timeSlot}
                          </span>
                          <span className="text-muted text-xs d-block">Fee Paid: ₹{app.fees} ({app.paymentStatus})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow Up Consultations Alerts */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold mb-3 text-dark">Follow-Up Reminders</h5>
                {upcomingFollowUps.length === 0 ? (
                  <div className="text-center py-4 bg-light rounded-3">
                    <p className="text-muted m-0 text-sm">No pending doctor follow-up schedule alerts.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {upcomingFollowUps.map(fu => (
                      <div key={fu._id} className="p-3 bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-3 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold m-0">Dr. {fu.doctorId?.userId?.name?.split(' ')[1]}</h6>
                          <span className="text-xs d-block mb-1 fw-medium">Required Checkup for Treatment</span>
                          <span className="text-xs d-block text-muted">{fu.notes}</span>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-warning text-white text-xs px-2 py-1 rounded">
                            {fu.followUpDate}
                          </span>
                          <span className="text-xs d-block text-muted mt-1">{fu.timeSlot}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Active Medications Tracker */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold m-0 text-dark">Active Medications</h5>
                  <Link to="/prescriptions" className="text-teal text-decoration-none text-sm fw-semibold d-flex align-items-center gap-1" style={{ color: '#0d9488' }}>
                    Open Tracker <FaAngleRight />
                  </Link>
                </div>
                {activeMedications.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-3 my-auto">
                    <FaCheckDouble className="fs-1 text-teal mb-3" style={{ color: '#0d9488' }} />
                    <p className="fw-bold m-0">No active medications!</p>
                    <p className="text-muted text-sm mb-0">All course tracks marked completed.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {activeMedications.map((med, index) => (
                      <div key={index} className="p-3 border border-light-subtle rounded-3 hover-shadow-sm transition-all">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="fw-bold text-dark m-0">{med.name}</h6>
                            <span className="text-muted text-xs d-block">
                              Dosage: {med.dosage} | Frequency: {med.frequency}
                            </span>
                            <span className="text-xs text-muted d-block">
                              Instruction: <strong>{med.instruction}</strong> ({med.duration})
                            </span>
                          </div>
                          <span className="badge bg-teal-subtle text-teal text-xs py-1 px-2" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                            Active
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-top border-light d-flex justify-content-between align-items-center">
                          <span className="text-muted text-xs">Prescribed by {med.doctorName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
