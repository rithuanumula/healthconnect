import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaCalendarCheck, FaIndianRupeeSign, FaBan } from 'react-icons/fa6';
import api from '../../utils/api';

const Appointments = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/admin/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load system appointments', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appId) => {
    if (!window.confirm('Cancel this appointment?')) return;

    setActionLoading(appId);
    try {
      const res = await api.put(`/appointments/${appId}/status`, { status: 'cancelled' });
      if (res.data.success) {
        setToast({ message: 'Appointment status cancelled successfully!', type: 'success' });
        fetchAppointments();
      }
    } catch (err) {
      setToast({ message: 'Failed to cancel appointment', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  return (
    <div className="dashboard-container">
      <Sidebar active={sidebarActive} toggleSidebar={toggleSidebar} />
      
      <div className="dashboard-content d-flex flex-column p-0">
        <Navbar toggleSidebar={toggleSidebar} isDashboard={true} />
        
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="p-4 flex-grow-1 fade-in-up">
          <div className="mb-4">
            <h2 className="fw-bold m-0 text-dark">Consultation Book Overview</h2>
            <p className="text-muted m-0">Monitor all slot bookings, physician consultations, and invoice payment streams.</p>
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            {loading ? (
              <Loader message="Loading appointment book..." />
            ) : appointments.length === 0 ? (
              <div className="text-center py-5">
                <FaCalendarCheck className="fs-1 text-muted mb-3" />
                <p className="text-muted m-0">No booking reservations log found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Patient Name</th>
                      <th>Consultant / Specialization</th>
                      <th>Scheduled Slot</th>
                      <th>Fees / Payment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => (
                      <tr key={app._id}>
                        <td>
                          <div className="fw-bold text-dark">{app.patientId?.name}</div>
                          <span className="text-muted text-xs">{app.patientId?.phone}</span>
                        </td>
                        <td>
                          <div className="fw-bold text-dark">{app.doctorId?.userId?.name}</div>
                          <span className="text-teal text-xs fw-semibold" style={{ color: '#0d9488' }}>
                            {app.doctorId?.specialization}
                          </span>
                        </td>
                        <td className="text-sm">
                          <div>{app.date}</div>
                          <span className="text-muted text-xs">{app.timeSlot}</span>
                        </td>
                        <td className="text-sm">
                          <div className="fw-bold text-dark d-flex align-items-center gap-0.5">
                            <FaIndianRupeeSign /> {app.fees}
                          </div>
                          <span className={`badge px-2.5 py-0.5 rounded text-xs fw-semibold ${app.paymentStatus === 'paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'}`}>
                            {app.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge px-3 py-1.5 rounded-pill text-xs fw-semibold text-capitalize badge-${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.status === 'scheduled' && (
                            <button
                              onClick={() => handleCancel(app._id)}
                              disabled={actionLoading === app._id}
                              className="btn btn-outline-danger btn-sm px-2 py-1 d-flex align-items-center gap-1 text-xs"
                              style={{ borderRadius: '6px' }}
                            >
                              <FaBan /> Cancel
                            </button>
                          )}
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

export default Appointments;
