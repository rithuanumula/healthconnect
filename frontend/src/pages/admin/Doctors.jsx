import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaUserDoctor, FaCircleCheck, FaCircleXmark, FaCheckDouble, FaCoins } from 'react-icons/fa6';
import api from '../../utils/api';

const Doctors = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/admin/doctors');
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load doctors list', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleVerify = async (doctorId, verifyStatus, doctorName) => {
    if (!window.confirm(`Are you sure you want to mark Dr. ${doctorName} as ${verifyStatus}?`)) return;

    setActionLoading(doctorId);
    try {
      const res = await api.put(`/admin/doctors/${doctorId}/verify`, { status: verifyStatus });
      if (res.data.success) {
        setToast({ message: `Doctor successfully verified/marked ${verifyStatus}!`, type: 'success' });
        fetchDoctors();
      }
    } catch (err) {
      setToast({ message: 'Failed to complete verification', type: 'error' });
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
            <h2 className="fw-bold m-0 text-dark">Clinician Verifications</h2>
            <p className="text-muted m-0">Validate credentials, clinics, and consultation fees for medical registrations.</p>
          </div>

          {loading ? (
            <Loader message="Loading clinician directory..." />
          ) : doctors.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 rounded-4 text-center bg-white">
              <FaUserDoctor className="fs-1 text-muted mb-3" />
              <h4 className="fw-bold">No clinician profiles found</h4>
              <p className="text-muted">No doctors have registered on the platform yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3.5">
              {doctors.map(doc => {
                const isPending = doc.status === 'pending';
                const isApproved = doc.status === 'approved';
                const isRejected = doc.status === 'rejected';

                return (
                  <div key={doc._id} className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                    <div className="row align-items-center g-3">
                      
                      {/* Name Specialization */}
                      <div className="col-lg-3 col-md-6">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="bg-primary-light text-teal rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                            style={{ width: '45px', height: '45px', backgroundColor: '#f0fdfa', color: '#0d9488' }}
                          >
                            {doc.userId?.name?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark m-0">{doc.userId?.name}</h6>
                            <span className="text-teal text-xs fw-semibold" style={{ color: '#0d9488' }}>
                              {doc.specialization}
                            </span>
                            <span className="text-muted text-xs d-block">{doc.userId?.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Credentials */}
                      <div className="col-lg-3 col-md-6 text-sm">
                        <span className="text-muted text-xs d-block mb-1">QUALIFICATION & FEES</span>
                        <div className="fw-semibold text-dark">{doc.qualification}</div>
                        <div className="text-muted text-xs">Experience: {doc.experience} Years</div>
                        <div className="fw-bold text-dark text-xs d-flex align-items-center gap-0.5 mt-0.5">
                          <FaCoins className="text-warning text-xs" /> Fees: ₹{doc.fees}
                        </div>
                      </div>

                      {/* Clinic Location */}
                      <div className="col-lg-3 col-md-6 text-xs text-muted">
                        <span className="text-muted text-xs d-block mb-1">CLINIC INFRASTRUCTURE</span>
                        <div className="fw-bold text-dark">{doc.clinicName}</div>
                        <div>{doc.clinicAddress}</div>
                        <div className="fw-medium text-dark">City: {doc.city}</div>
                      </div>

                      {/* Verification Status */}
                      <div className="col-lg-1 col-md-6">
                        <span className="text-muted text-xs d-block mb-1">STATUS</span>
                        <span className={`badge px-3 py-1.5 rounded-pill text-xs fw-semibold text-capitalize ${isApproved ? 'bg-success-subtle text-success' : isRejected ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning-emphasis'}`}>
                          {doc.status}
                        </span>
                      </div>

                      {/* Actions Verify */}
                      <div className="col-lg-2 col-md-6 text-md-end">
                        {isPending ? (
                          <div className="d-flex gap-1.5 justify-content-md-end">
                            <button
                              onClick={() => handleVerify(doc._id, 'approved', doc.userId?.name)}
                              disabled={actionLoading === doc._id}
                              className="btn btn-teal text-white btn-sm px-2.5 py-1.5 d-flex align-items-center gap-1"
                              style={{ backgroundColor: '#0d9488', borderRadius: '6px', fontSize: '0.8rem' }}
                            >
                              <FaCircleCheck /> Approve
                            </button>
                            <button
                              onClick={() => handleVerify(doc._id, 'rejected', doc.userId?.name)}
                              disabled={actionLoading === doc._id}
                              className="btn btn-outline-danger btn-sm px-2.5 py-1.5 d-flex align-items-center gap-1"
                              style={{ borderRadius: '6px', fontSize: '0.8rem' }}
                            >
                              <FaCircleXmark /> Reject
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-md-end gap-1.5">
                            {!isApproved && (
                              <button
                                onClick={() => handleVerify(doc._id, 'approved', doc.userId?.name)}
                                disabled={actionLoading === doc._id}
                                className="btn btn-light btn-sm text-success text-xs"
                                style={{ borderRadius: '6px' }}
                              >
                                Re-Approve
                              </button>
                            )}
                            {!isRejected && (
                              <button
                                onClick={() => handleVerify(doc._id, 'rejected', doc.userId?.name)}
                                disabled={actionLoading === doc._id}
                                className="btn btn-light btn-sm text-danger text-xs"
                                style={{ borderRadius: '6px' }}
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
                        )}
                      </div>

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

export default Doctors;
