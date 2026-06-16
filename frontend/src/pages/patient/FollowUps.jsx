import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaClock, FaUserDoctor, FaCircleCheck } from 'react-icons/fa6';
import api from '../../utils/api';

const FollowUps = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchFollowUps = async () => {
    try {
      const res = await api.get('/follow-ups/patient');
      if (res.data.success) {
        setFollowUps(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
      setToast({ message: 'Failed to load follow-up reminders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleMarkCompleted = async (fuId) => {
    setActionLoading(fuId);
    try {
      const res = await api.put(`/follow-ups/${fuId}/status`, { status: 'completed' });
      if (res.data.success) {
        setToast({ message: 'Follow-up consultation marked completed!', type: 'success' });
        fetchFollowUps();
      }
    } catch (err) {
      setToast({ message: 'Failed to update follow-up status', type: 'error' });
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
            <h2 className="fw-bold m-0 text-dark">Follow-Up Reminders</h2>
            <p className="text-muted m-0">Track upcoming consultation recommendations scheduled by your doctors.</p>
          </div>

          {loading ? (
            <Loader message="Loading reminders details..." />
          ) : followUps.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <FaClock className="fs-1 text-muted mb-3" />
              <h4 className="fw-bold">No follow-ups scheduled</h4>
              <p className="text-muted">You have no pending follow-up consultations recommended by your doctors.</p>
            </div>
          ) : (
            <div className="row g-3">
              {followUps.map(fu => {
                const isCompleted = fu.status === 'completed';
                
                return (
                  <div key={fu._id} className="col-lg-6">
                    <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 transition-all ${isCompleted ? 'bg-light opacity-75' : 'bg-white'}`}>
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="bg-teal-subtle text-teal rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                            style={{ width: '45px', height: '45px', backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}
                          >
                            {fu.doctorId?.userId?.name?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark m-0">{fu.doctorId?.userId?.name}</h6>
                            <span className="text-teal text-xs fw-semibold" style={{ color: '#0d9488' }}>
                              {fu.doctorId?.specialization}
                            </span>
                          </div>
                        </div>
                        
                        <span className={`badge px-2.5 py-1 text-xs fw-bold text-capitalize ${isCompleted ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'}`}>
                          {fu.status}
                        </span>
                      </div>

                      <div className="p-3 bg-light rounded-3 mb-3">
                        <span className="text-muted text-xs d-block mb-1">PROPOSED SCHEDULE:</span>
                        <span className="fw-bold text-dark text-sm d-block mb-1">
                          Date: {fu.followUpDate} | Time Slot: {fu.timeSlot}
                        </span>
                        {fu.notes && (
                          <p className="text-muted text-xs mb-0 mt-2 italic">
                            <strong>Instructions:</strong> "{fu.notes}"
                          </p>
                        )}
                      </div>

                      {!isCompleted && (
                        <button
                          onClick={() => handleMarkCompleted(fu._id)}
                          disabled={actionLoading === fu._id}
                          className="btn btn-outline-teal btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                          style={{ borderColor: '#0d9488', color: '#0d9488', borderRadius: '6px' }}
                        >
                          <FaCircleCheck /> Mark Checked / Completed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowUps;
