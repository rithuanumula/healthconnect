import React, { useState, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';
import { AuthContext } from '../../context/AuthContext';
import { FaUserPen } from 'react-icons/fa6';

const ProfileSettings = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [sidebarActive, setSidebarActive] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [age, setAge] = useState(user?.age || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify phone length/regex
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setToast({ message: 'Please enter a valid 10-digit Indian phone number', type: 'error' });
      return;
    }

    setLoading(true);
    const result = await updateProfile({
      name,
      phone,
      gender,
      age: age ? parseInt(age) : undefined,
      profilePic
    });

    if (result.success) {
      setToast({ message: 'Profile details updated successfully!', type: 'success' });
    } else {
      setToast({ message: result.message, type: 'error' });
    }
    setLoading(false);
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
            <h2 className="fw-bold m-0 text-dark">Profile Settings</h2>
            <p className="text-muted m-0">Update your demographic details and contact parameters.</p>
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ maxWidth: '600px' }}>
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaUserPen className="text-teal" style={{ color: '#0d9488' }} /> Account Demographics
            </h5>
            
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-muted text-sm fw-medium">Full Name</label>
                  <input
                    type="text"
                    className="form-control custom-form-control"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted text-sm fw-medium">Email Address (Read-only)</label>
                  <input
                    type="email"
                    className="form-control custom-form-control bg-light"
                    disabled
                    value={user?.email || ''}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted text-sm fw-medium">Indian Phone Number</label>
                  <input
                    type="tel"
                    className="form-control custom-form-control"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted text-sm fw-medium">Gender</label>
                  <select
                    className="form-select custom-form-control"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted text-sm fw-medium">Age</label>
                  <input
                    type="number"
                    className="form-control custom-form-control"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label text-muted text-sm fw-medium">Avatar Image URL (Optional)</label>
                  <input
                    type="url"
                    className="form-control custom-form-control"
                    placeholder="https://images.unsplash.com/... or base64 data"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-teal text-white w-100 py-2.5 fw-bold mt-4"
                style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}
              >
                {loading ? 'Saving details...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
