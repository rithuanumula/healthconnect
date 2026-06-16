import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaUsers, FaUser, FaTimeline, FaBookMedical, FaFileArrowDown } from 'react-icons/fa6';
import api from '../../utils/api';

const Patients = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Health Timeline viewer states
  const [activePatient, setActivePatient] = useState(null); // stores selected patient user object
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/appointments/doctor');
        const apps = res.data.data;

        // Extract unique patient objects
        const patientMap = {};
        apps.forEach(app => {
          if (app.patientId && !patientMap[app.patientId._id]) {
            patientMap[app.patientId._id] = app.patientId;
          }
        });

        setPatients(Object.values(patientMap));
      } catch (err) {
        console.error(err);
        setToast({ message: 'Failed to load patients list', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleOpenTimeline = async (patient) => {
    setActivePatient(patient);
    setTimelineLoading(true);
    try {
      // Fetch both medical records and prescriptions for this patient
      const recordsRes = await api.get(`/medical-records/patient/${patient._id}`);
      const prescRes = await api.get(`/prescriptions/patient/${patient._id}`);

      setPatientRecords(recordsRes.data.data || []);
      setPatientPrescriptions(prescRes.data.data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Error loading patient health history timeline', type: 'error' });
    } finally {
      setTimelineLoading(false);
    }
  };

  const getCombinedTimeline = () => {
    const items = [];

    patientRecords.forEach(rec => {
      items.push({
        type: 'record',
        date: new Date(rec.uploadDate),
        title: rec.title,
        category: rec.category,
        description: rec.description,
        fileUrl: rec.fileUrl,
        raw: rec
      });
    });

    patientPrescriptions.forEach(pr => {
      items.push({
        type: 'prescription',
        date: new Date(pr.date),
        title: `Clinical Diagnosis: ${pr.diagnosis}`,
        category: 'Prescription Detail',
        description: pr.medications.map(m => `${m.name} (${m.dosage} - ${m.frequency})`).join(', '),
        raw: pr
      });
    });

    // Sort in descending order of date (most recent first)
    return items.sort((a, b) => b.date - a.date);
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
            <h2 className="fw-bold m-0 text-dark">My Patients</h2>
            <p className="text-muted m-0">Browse patients who booked consultations and access their medical timelines.</p>
          </div>

          <div className="row g-4">
            {/* Patients List Column */}
            <div className={activePatient ? 'col-lg-6' : 'col-12'}>
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaUsers className="text-teal" style={{ color: '#0d9488' }} /> Active Consulting Directory
                </h5>

                {loading ? (
                  <Loader message="Loading consulting directory..." />
                ) : patients.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-3">
                    <p className="text-muted m-0">No active consulting records found for patients.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Patient Info</th>
                          <th>Contact Details</th>
                          <th>Demographics</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map(pat => (
                          <tr key={pat._id} className={activePatient?._id === pat._id ? 'table-active' : ''}>
                            <td>
                              <div className="fw-bold text-dark">{pat.name}</div>
                              <span className="text-muted text-xs">{pat.email}</span>
                            </td>
                            <td className="text-sm">{pat.phone}</td>
                            <td className="text-sm">
                              {pat.gender || 'N/A'} / {pat.age || 'N/A'} Yrs
                            </td>
                            <td>
                              <button
                                onClick={() => handleOpenTimeline(pat)}
                                className="btn btn-teal btn-sm text-white px-3"
                                style={{ backgroundColor: '#0d9488', borderRadius: '6px' }}
                              >
                                View Timeline
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Health History Timeline Column */}
            {activePatient && (
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white fade-in-up">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <div>
                      <span className="text-muted text-xs">HEALTH TIMELINE SECURE VIEW</span>
                      <h5 className="fw-bold text-dark m-0">{activePatient.name}</h5>
                    </div>
                    <button type="button" className="btn-close" onClick={() => setActivePatient(null)}></button>
                  </div>

                  {timelineLoading ? (
                    <Loader message="Retrieving secure health timeline..." />
                  ) : getCombinedTimeline().length === 0 ? (
                    <div className="text-center py-5 bg-light rounded-3">
                      <FaTimeline className="fs-1 text-muted mb-3" />
                      <p className="fw-bold m-0 text-muted text-sm">Locker and medical timeline empty</p>
                      <p className="text-muted text-xs mb-0">No medical uploads or prescriptions logged yet.</p>
                    </div>
                  ) : (
                    <div className="timeline" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                      {getCombinedTimeline().map((item, index) => (
                        <div key={index} className="timeline-item fade-in-up">
                          <div className="timeline-marker" style={item.type === 'prescription' ? { backgroundColor: '#0284c7' } : {}}></div>
                          <div className="p-3 border border-light-subtle rounded-3 bg-light-subtle">
                            
                            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                              <div>
                                <span className="text-muted text-xs d-block mb-1">
                                  {item.date.toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                                <h6 className="fw-bold text-dark m-0">{item.title}</h6>
                                <span
                                  className={`badge mt-1.5 px-2 py-1 text-xs fw-semibold ${item.type === 'prescription' ? 'bg-info-subtle text-info' : 'bg-teal-subtle text-teal'}`}
                                  style={item.type === 'record' ? { backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' } : {}}
                                >
                                  {item.category}
                                </span>
                              </div>
                              
                              {item.type === 'record' && (
                                <a
                                  href={`http://localhost:5000${item.fileUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-light btn-sm text-teal"
                                  style={{ color: '#0d9488' }}
                                  title="Download File"
                                >
                                  <FaFileArrowDown />
                                </a>
                              )}
                            </div>

                            <p className="text-muted text-xs mb-0">
                              {item.description}
                            </p>

                            {/* Render medication lists if it's a prescription */}
                            {item.type === 'prescription' && (
                              <div className="mt-2.5 pt-2 border-top border-light-subtle">
                                <span className="text-xs fw-bold text-muted d-block mb-1">Prescribed Drugs list:</span>
                                <div className="d-flex flex-column gap-1">
                                  {item.raw.medications.map((m, mIdx) => (
                                    <div key={mIdx} className="text-xs text-secondary d-flex justify-content-between">
                                      <span>• {m.name} ({m.dosage})</span>
                                      <span>{m.frequency} | {m.duration} | {m.instruction}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
