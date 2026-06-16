import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaFileMedical, FaTrash, FaCloudArrowUp, FaFileArrowDown, FaTimeline } from 'react-icons/fa6';
import api from '../../utils/api';

const categories = ['Lab Report', 'Prescription', 'Scan', 'Discharge Summary', 'Other'];

const MedicalRecords = () => {
  const { user } = useContext(AuthContext);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await api.get(`/medical-records/patient/${user._id}`);
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setToast({ message: 'Failed to load health timeline records', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user._id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setToast({ message: 'Please select a report file to upload', type: 'error' });
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('report', file);

      const res = await api.post('/medical-records/upload', formData);

      if (res.data.success) {
        setToast({ message: 'Medical report added to timeline!', type: 'success' });
        setTitle('');
        setDescription('');
        setFile(null);
        // Clear input element
        document.getElementById('fileInput').value = '';
        fetchRecords();
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Upload failed. File limit is 10MB.', type: 'error' });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('Delete this record from your timeline?')) return;

    try {
      const res = await api.delete(`/medical-records/${recordId}`);
      if (res.data.success) {
        setToast({ message: 'Record deleted from timeline', type: 'success' });
        fetchRecords();
      }
    } catch (err) {
      setToast({ message: 'Failed to delete record', type: 'error' });
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
            <h2 className="fw-bold m-0 text-dark">Medical Records (Health Locker)</h2>
            <p className="text-muted m-0">Store reports or browse your chronological treatment history timeline.</p>
          </div>

          <div className="row g-4">
            
            {/* Upload Report Column */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white sticky-top" style={{ top: '100px', zIndex: 10 }}>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaCloudArrowUp className="text-teal" style={{ color: '#0d9488' }} /> Upload New Report
                </h5>
                <form onSubmit={handleUploadSubmit}>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted text-sm fw-medium">Report Title / Lab Test</label>
                    <input
                      type="text"
                      className="form-control custom-form-control"
                      required
                      placeholder="e.g. Thyroid Profile Test"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted text-sm fw-medium">Category</label>
                    <select
                      className="form-select custom-form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted text-sm fw-medium">Upload File (PDF / JPEG / PNG)</label>
                    <input
                      type="file"
                      id="fileInput"
                      className="form-control custom-form-control"
                      required
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted text-sm fw-medium">Brief Description / Remarks</label>
                    <textarea
                      className="form-control custom-form-control"
                      rows="3"
                      placeholder="e.g. Dr. Sharma review pending"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="btn btn-teal text-white w-100 py-2.5 fw-bold"
                    style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}
                  >
                    {uploadLoading ? 'Uploading document...' : 'Add to Health Timeline'}
                  </button>

                </form>
              </div>
            </div>

            {/* Timeline Column */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <FaTimeline className="text-teal" style={{ color: '#0d9488' }} /> Chronological Health Timeline
                </h5>
                
                {loading ? (
                  <Loader message="Loading timeline events..." />
                ) : records.length === 0 ? (
                  <div className="text-center py-5">
                    <FaFileMedical className="fs-1 text-muted mb-3" />
                    <p className="fw-bold m-0">Timeline locker empty</p>
                    <p className="text-muted text-sm">Add files using the upload manager on the left.</p>
                  </div>
                ) : (
                  <div className="timeline">
                    {records.map(rec => (
                      <div key={rec._id} className="timeline-item fade-in-up">
                        <div className="timeline-marker"></div>
                        <div className="p-3 border border-light-subtle rounded-3 bg-light-subtle">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div>
                              <span className="text-muted text-xs d-block mb-1">
                                {new Date(rec.uploadDate).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              <h6 className="fw-bold text-dark m-0">{rec.title}</h6>
                              <span
                                className="badge bg-teal-subtle text-teal timeline-category-badge mt-1.5"
                                style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}
                              >
                                {rec.category}
                              </span>
                            </div>
                            
                            <div className="d-flex gap-1">
                              {/* Open/Download URL */}
                              <a
                                href={`http://localhost:5000${rec.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-light btn-sm text-teal"
                                style={{ color: '#0d9488' }}
                                title="Download Report File"
                              >
                                <FaFileArrowDown />
                              </a>
                              <button
                                onClick={() => handleDelete(rec._id)}
                                className="btn btn-light btn-sm text-danger"
                                title="Delete Record"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>

                          {rec.description && (
                            <div className="mt-2.5 pt-2 border-top border-light text-muted text-sm">
                              {rec.description}
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
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
