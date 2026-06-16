import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaBookMedical, FaSquareCheck, FaSquare } from 'react-icons/fa6';
import api from '../../utils/api';

const Prescriptions = () => {
  const { user } = useContext(AuthContext);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null); // stores active prescId-medIndex

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get(`/prescriptions/patient/${user._id}`);
      if (res.data.success) {
        setPrescriptions(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setToast({ message: 'Failed to load prescriptions details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [user._id]);

  const handleToggleMedStatus = async (prescId, medIndex) => {
    const key = `${prescId}-${medIndex}`;
    setToggleLoading(key);
    try {
      const res = await api.put(`/prescriptions/${prescId}/medication/${medIndex}`, {});
      if (res.data.success) {
        setToast({ message: 'Medication track status updated successfully!', type: 'success' });
        fetchPrescriptions();
      }
    } catch (err) {
      setToast({ message: 'Failed to update medication tracker', type: 'error' });
    } finally {
      setToggleLoading(null);
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
            <h2 className="fw-bold m-0 text-dark">Prescription Tracker</h2>
            <p className="text-muted m-0">View clinical recommendations and toggle medication completion statuses.</p>
          </div>

          {loading ? (
            <Loader message="Loading prescriptions..." />
          ) : prescriptions.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <FaBookMedical className="fs-1 text-muted mb-3" />
              <h4 className="fw-bold">No active prescriptions</h4>
              <p className="text-muted">You don't have any medical treatment prescriptions logged yet.</p>
            </div>
          ) : (
            <div className="row g-4">
              {prescriptions.map(presc => {
                // Calculate completion metrics
                const totalMeds = presc.medications.length;
                const completedMeds = presc.medications.filter(m => m.status === 'completed').length;
                const completionPercentage = Math.round((completedMeds / totalMeds) * 100);

                return (
                  <div key={presc._id} className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between">
                      <div>
                        {/* Prescription Header */}
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                          <div>
                            <span className="text-muted text-xs d-block mb-0.5">
                              {new Date(presc.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <h5 className="fw-bold text-dark m-0">{presc.doctorId?.userId?.name}</h5>
                            <span className="text-teal text-xs fw-semibold" style={{ color: '#0d9488' }}>
                              {presc.doctorId?.specialization}
                            </span>
                          </div>
                          <span className="badge bg-light text-dark border px-2.5 py-1.5 rounded text-xs fw-bold">
                            Diagnosis: {presc.diagnosis}
                          </span>
                        </div>

                        {/* Completion Progress Bar */}
                        <div className="mb-4 bg-light p-2.5 rounded-3">
                          <div className="d-flex justify-content-between text-xs mb-1.5 fw-semibold text-muted">
                            <span>Medication Course Tracker</span>
                            <span className="text-teal" style={{ color: '#0d9488' }}>{completedMeds} of {totalMeds} Completed ({completionPercentage}%)</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${completionPercentage}%`, backgroundColor: '#0d9488' }}
                              aria-valuenow={completionPercentage}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>

                        {/* Medications Tracker Checklist */}
                        <div className="d-flex flex-column gap-3.5">
                          {presc.medications.map((med, index) => {
                            const isCompleted = med.status === 'completed';
                            const key = `${presc._id}-${index}`;
                            
                            return (
                              <div
                                key={index}
                                className={`p-3 rounded-3 border d-flex justify-content-between align-items-center transition-all ${isCompleted ? 'bg-light border-light-subtle opacity-75' : 'bg-white border-light-subtle'}`}
                              >
                                <div>
                                  <h6 className={`fw-bold m-0 ${isCompleted ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                                    {med.name}
                                  </h6>
                                  <span className="text-muted text-xs d-block">
                                    Dosage: {med.dosage} | Frequency: {med.frequency}
                                  </span>
                                  <span className="text-muted text-xs d-block">
                                    Instruction: <strong>{med.instruction}</strong> ({med.duration})
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  disabled={toggleLoading === key}
                                  onClick={() => handleToggleMedStatus(presc._id, index)}
                                  className={`btn p-1.5 border-0 bg-transparent fs-4 d-flex align-items-center justify-content-center ${isCompleted ? 'text-success' : 'text-muted'}`}
                                  title={isCompleted ? 'Mark Active' : 'Mark Completed'}
                                >
                                  {isCompleted ? <FaSquareCheck /> : <FaSquare />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
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

export default Prescriptions;
