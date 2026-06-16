import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaCalendarCheck, FaUser, FaStethoscope, FaPlus, FaTrash, FaRegClock, FaCalendarPlus } from 'react-icons/fa6';
import api from '../../utils/api';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const Appointments = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Consult Form Overlay State
  const [activeConsult, setActiveConsult] = useState(null); // stores active appointment object
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instruction: 'After food' }]);
  
  // Follow Up state (optional)
  const [scheduleFollowUp, setScheduleFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpSlot, setFollowUpSlot] = useState(timeSlots[0]);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/doctor');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setToast({ message: 'Failed to load appointments details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appId) => {
    if (!window.confirm('Are you sure you want to cancel this consultation?')) return;
    try {
      const res = await api.put(`/appointments/${appId}/status`, { status: 'cancelled' });
      if (res.data.success) {
        setToast({ message: 'Appointment cancelled successfully!', type: 'success' });
        fetchAppointments();
      }
    } catch (err) {
      setToast({ message: 'Failed to cancel appointment', type: 'error' });
    }
  };

  const handleStartConsult = (app) => {
    setActiveConsult(app);
    setDiagnosis('');
    setMedications([{ name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instruction: 'After food' }]);
    setScheduleFollowUp(false);
    setFollowUpDate('');
    setFollowUpNotes('');
  };

  const handleAddMed = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instruction: 'After food' }]);
  };

  const handleRemoveMed = (index) => {
    const list = [...medications];
    list.splice(index, 1);
    setMedications(list);
  };

  const handleMedChange = (index, field, value) => {
    const list = [...medications];
    list[index][field] = value;
    setMedications(list);
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis) {
      setToast({ message: 'Please enter a diagnosis', type: 'error' });
      return;
    }

    // Validate meds
    for (let med of medications) {
      if (!med.name || !med.dosage) {
        setToast({ message: 'Please enter name and dosage for all medications', type: 'error' });
        return;
      }
    }

    setSubmitting(true);
    try {
      // 1. Create prescription (marks appointment completed automatically)
      const prescRes = await api.post('/prescriptions', {
        patientId: activeConsult.patientId._id,
        appointmentId: activeConsult._id,
        diagnosis,
        medications
      });

      if (prescRes.data.success) {
        // 2. Optional: Schedule Follow up
        if (scheduleFollowUp && followUpDate) {
          await api.post('/follow-ups', {
            patientId: activeConsult.patientId._id,
            originalAppointmentId: activeConsult._id,
            followUpDate,
            timeSlot: followUpSlot,
            notes: followUpNotes || `Follow-up checkup for ${diagnosis}`
          });
        }

        setToast({ message: 'Consultation completed and prescription logged!', type: 'success' });
        setActiveConsult(null);
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.message || 'Error completing consultation', type: 'error' });
    } finally {
      setSubmitting(false);
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
            <h2 className="fw-bold m-0 text-dark">Appointment Management</h2>
            <p className="text-muted m-0">Diagnose patient consultations, write prescriptions, and schedule follow-ups.</p>
          </div>

          {loading ? (
            <Loader message="Loading appointment book..." />
          ) : appointments.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <FaCalendarCheck className="fs-1 text-muted mb-3" />
              <h4 className="fw-bold">No appointments booked</h4>
              <p className="text-muted">You have no consulting queue entries currently.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {appointments.map(app => (
                <div key={app._id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <div className="row align-items-center g-3">
                    
                    <div className="col-md-4">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary-light text-teal rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                          style={{ width: '45px', height: '45px', backgroundColor: '#f0fdfa', color: '#0d9488' }}
                        >
                          <FaUser />
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark m-0">{app.patientId?.name}</h6>
                          <span className="text-muted text-xs d-block">
                            Phone: {app.patientId?.phone} | Age: {app.patientId?.age || 'N/A'} Yrs
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <span className="text-muted text-xs d-block mb-1">DATE & SLOT</span>
                      <span className="fw-semibold text-dark text-sm d-block">
                        {app.date}
                      </span>
                      <span className="text-muted text-xs d-block">
                        Slot: {app.timeSlot}
                      </span>
                    </div>

                    <div className="col-md-2">
                      <span className="text-muted text-xs d-block mb-1">CONSULTATION STATUS</span>
                      <span className={`badge px-3 py-1.5 rounded-pill text-xs fw-semibold text-capitalize badge-${app.status}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="col-md-3 text-md-end">
                      <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        {app.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => handleStartConsult(app)}
                              className="btn btn-teal text-white btn-sm px-3.5 py-2 d-flex align-items-center gap-1.5"
                              style={{ backgroundColor: '#0d9488', borderRadius: '6px' }}
                            >
                              <FaStethoscope /> Start Consult
                            </button>
                            <button
                              onClick={() => handleCancel(app._id)}
                              className="btn btn-outline-danger btn-sm px-3.5 py-2"
                              style={{ borderRadius: '6px' }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {app.status === 'completed' && (
                          <span className="text-success text-xs fw-semibold">Prescription Logged</span>
                        )}
                      </div>
                    </div>

                    {app.notes && (
                      <div className="col-12 border-top pt-3 mt-3 text-xs text-muted">
                        <strong>Patient remarks:</strong> "{app.notes}"
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Consultation Writing Modal/Card (renders overlay if active) */}
          {activeConsult && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
              style={{ backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 1050, overflowY: 'auto' }}
            >
              <div className="card border-0 shadow-lg p-4 rounded-4 bg-white w-100 my-4" style={{ maxWidth: '680px' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                  <h4 className="fw-bold m-0 text-dark">Consultation Room</h4>
                  <button type="button" className="btn-close" onClick={() => setActiveConsult(null)}></button>
                </div>

                <div className="bg-light p-3 rounded-3 mb-4 text-sm">
                  <strong>Patient Name:</strong> {activeConsult.patientId?.name} | <strong>Gender:</strong> {activeConsult.patientId?.gender} | <strong>Age:</strong> {activeConsult.patientId?.age || 'N/A'} Yrs
                </div>

                <form onSubmit={handleConsultSubmit}>
                  
                  {/* Diagnosis */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-muted">Diagnosis / Clinical Findings</label>
                    <input
                      type="text"
                      className="form-control custom-form-control"
                      required
                      placeholder="e.g. Acute Migraine / Seasonal Viral Fever"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>

                  {/* Medications Manager */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-bold text-muted m-0">Medication Prescription Tracker</label>
                      <button
                        type="button"
                        onClick={handleAddMed}
                        className="btn btn-teal text-white btn-sm px-2.5 py-1 d-flex align-items-center gap-1"
                        style={{ backgroundColor: '#0d9488', borderRadius: '6px', fontSize: '0.8rem' }}
                      >
                        <FaPlus /> Add Drug
                      </button>
                    </div>

                    <div className="d-flex flex-column gap-3.5">
                      {medications.map((med, index) => (
                        <div key={index} className="p-3 border rounded-3 bg-light-subtle d-flex flex-column gap-3 position-relative">
                          <div className="row g-2">
                            <div className="col-md-5">
                              <label className="text-xs fw-semibold text-muted mb-1">Medicine Name</label>
                              <input
                                type="text"
                                className="form-control custom-form-control py-1 px-2.5"
                                placeholder="e.g. Paracetamol 650mg"
                                required
                                value={med.name}
                                onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="text-xs fw-semibold text-muted mb-1">Dosage Format</label>
                              <input
                                type="text"
                                className="form-control custom-form-control py-1 px-2.5"
                                placeholder="e.g. 1 Tablet"
                                required
                                value={med.dosage}
                                onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="text-xs fw-semibold text-muted mb-1">Frequency</label>
                              <select
                                className="form-select custom-form-control py-1 px-2.5"
                                value={med.frequency}
                                onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                              >
                                <option value="1-0-1">1-0-1 (Morning & Night)</option>
                                <option value="1-1-1">1-1-1 (Morning, Noon & Night)</option>
                                <option value="1-0-0">1-0-0 (Morning Only)</option>
                                <option value="0-0-1">0-0-1 (Night Only)</option>
                                <option value="As needed">As needed (SOS)</option>
                              </select>
                            </div>
                          </div>

                          <div className="row g-2">
                            <div className="col-md-4">
                              <label className="text-xs fw-semibold text-muted mb-1">Duration</label>
                              <input
                                type="text"
                                className="form-control custom-form-control py-1 px-2.5"
                                placeholder="e.g. 5 days / 1 month"
                                required
                                value={med.duration}
                                onChange={(e) => handleMedChange(index, 'duration', e.target.value)}
                              />
                            </div>
                            <div className="col-md-5">
                              <label className="text-xs fw-semibold text-muted mb-1">Instruction</label>
                              <select
                                className="form-select custom-form-control py-1 px-2.5"
                                value={med.instruction}
                                onChange={(e) => handleMedChange(index, 'instruction', e.target.value)}
                              >
                                <option value="After food">After food</option>
                                <option value="Before food">Before food</option>
                                <option value="Empty stomach">Empty stomach</option>
                                <option value="As needed">As needed</option>
                              </select>
                            </div>
                            
                            <div className="col-md-3 d-flex align-items-end justify-content-end">
                              {medications.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMed(index)}
                                  className="btn btn-outline-danger btn-sm w-100 py-1.5"
                                >
                                  <FaTrash /> Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Follow-up checkbox toggler */}
                  <div className="mb-4 pt-2 border-top">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="followUpSwitch"
                        checked={scheduleFollowUp}
                        onChange={(e) => setScheduleFollowUp(e.target.checked)}
                      />
                      <label className="form-check-label fw-bold text-muted" htmlFor="followUpSwitch">
                        Schedule Follow-Up Consultation
                      </label>
                    </div>

                    {scheduleFollowUp && (
                      <div className="row g-3 p-3 bg-light rounded-3 fade-in-up">
                        <div className="col-md-6">
                          <label className="form-label text-xs fw-semibold text-muted">Follow-up Date</label>
                          <input
                            type="date"
                            className="form-control custom-form-control py-1 px-2.5"
                            required={scheduleFollowUp}
                            min={new Date().toISOString().split('T')[0]}
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-xs fw-semibold text-muted">Preferred Time Slot</label>
                          <select
                            className="form-select custom-form-control py-1 px-2.5"
                            value={followUpSlot}
                            onChange={(e) => setFollowUpSlot(e.target.value)}
                          >
                            {timeSlots.map(slot => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label text-xs fw-semibold text-muted">Clinical Notes for Follow-Up</label>
                          <input
                            type="text"
                            className="form-control custom-form-control py-1 px-2.5"
                            placeholder="e.g. Review BP readings and thyroid markers check"
                            value={followUpNotes}
                            onChange={(e) => setFollowUpNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4 py-2"
                      onClick={() => setActiveConsult(null)}
                    >
                      Close Room
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-teal text-white px-4 py-2 fw-bold"
                      style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}
                    >
                      {submitting ? 'Submitting clinical logs...' : 'Complete Consultation'}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Appointments;
