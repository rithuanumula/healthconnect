import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaCalendarCheck, FaIndianRupeeSign, FaBan, FaCreditCard } from 'react-icons/fa6';
import api from '../../utils/api';

const MyAppointments = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // stores ID of active loader

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/patient');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setToast({ message: 'Failed to load appointments', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    
    setActionLoading(appId);
    try {
      const res = await api.put(`/appointments/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setToast({ message: `Appointment status updated to ${newStatus}!`, type: 'success' });
        fetchAppointments();
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update status', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePayment = async (appId) => {
    setActionLoading(appId);
    try {
      const res = await api.put(`/appointments/${appId}/payment`, { paymentStatus: 'paid' });
      if (res.data.success) {
        setToast({ message: 'Payment of consultation fees successful! (Simulated)', type: 'success' });
        fetchAppointments();
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to complete payment', type: 'error' });
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
            <h2 className="fw-bold m-0 text-dark">My Appointments</h2>
            <p className="text-muted m-0">Track status, pay fees, or cancel reservations.</p>
          </div>

          {loading ? (
            <Loader message="Loading appointments details..." />
          ) : appointments.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <FaCalendarCheck className="fs-1 text-muted mb-3" />
              <h4 className="fw-bold">No appointments found</h4>
              <p className="text-muted">You haven't scheduled any consultation appointments yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {appointments.map(app => (
                <div key={app._id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <div className="row align-items-center g-3">
                    
                    {/* Doctor Info */}
                    <div className="col-lg-4 col-md-6">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-teal-subtle text-teal rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                          style={{ width: '50px', height: '50px', backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}
                        >
                          {app.doctorId?.userId?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <h5 className="fw-bold m-0 text-dark">{app.doctorId?.userId?.name}</h5>
                          <span className="text-teal text-xs fw-semibold" style={{ color: '#0d9488' }}>
                            {app.doctorId?.specialization}
                          </span>
                          <span className="text-muted text-xs d-block">{app.doctorId?.clinicName}</span>
                        </div>
                      </div>
                    </div>

                    {/* DateTime & Fees */}
                    <div className="col-lg-3 col-md-6">
                      <span className="text-muted text-xs d-block mb-1">SCHEDULED SLOT</span>
                      <span className="fw-bold text-dark d-block">
                        {app.date}
                      </span>
                      <span className="text-muted text-xs d-block">
                        Time Slot: {app.timeSlot}
                      </span>
                      <span className="fw-bold text-dark d-flex align-items-center gap-1 text-sm mt-1">
                        Consultation Fees: <FaIndianRupeeSign /> {app.fees}
                      </span>
                    </div>

                    {/* Badges Status */}
                    <div className="col-lg-2 col-md-6">
                      <div className="mb-2">
                        <span className="text-muted text-xs d-block mb-1">STATUS</span>
                        <span className={`badge px-3 py-1.5 rounded-pill text-xs fw-semibold text-capitalize badge-${app.status}`}>
                          {app.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted text-xs d-block mb-1">PAYMENT</span>
                        <span className={`badge px-3 py-1.5 rounded-pill text-xs fw-semibold ${app.paymentStatus === 'paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'}`}>
                          {app.paymentStatus === 'paid' ? 'Paid (Online)' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-lg-3 col-md-6 text-lg-end">
                      <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                        
                        {/* Pay Fees */}
                        {app.status !== 'cancelled' && app.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handlePayment(app._id)}
                            disabled={actionLoading === app._id}
                            className="btn btn-teal text-white btn-sm px-3 py-2 d-flex align-items-center gap-1.5"
                            style={{ backgroundColor: '#0d9488', borderRadius: '6px' }}
                          >
                            <FaCreditCard /> Pay Online
                          </button>
                        )}

                        {/* Cancel Appointment */}
                        {app.status === 'scheduled' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'cancelled')}
                            disabled={actionLoading === app._id}
                            className="btn btn-outline-danger btn-sm px-3 py-2 d-flex align-items-center gap-1.5"
                            style={{ borderRadius: '6px' }}
                          >
                            <FaBan /> Cancel
                          </button>
                        )}
                        
                      </div>
                    </div>

                    {/* Notes if any */}
                    {app.notes && (
                      <div className="col-12 border-top pt-3 mt-3">
                        <span className="text-muted text-xs d-block fw-semibold mb-1">YOUR NOTES:</span>
                        <p className="bg-light p-2.5 rounded-3 text-muted text-xs mb-0">{app.notes}</p>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
