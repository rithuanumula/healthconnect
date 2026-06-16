import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { FaUsers, FaUserTag } from 'react-icons/fa6';
import api from '../../utils/api';

const Users = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load users list', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users whenever filter state changes
  useEffect(() => {
    let list = [...users];

    if (roleFilter) {
      list = list.filter(u => u.role === roleFilter);
    }

    if (searchTerm) {
      list = list.filter(
        u =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.phone.includes(searchTerm)
      );
    }

    setFilteredUsers(list);
  }, [roleFilter, searchTerm, users]);

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
            <h2 className="fw-bold m-0 text-dark">User Directory</h2>
            <p className="text-muted m-0">View all patients, verified/pending doctors, and administrators registered on the platform.</p>
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            
            {/* Filters */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control custom-form-control"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-select custom-form-control"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="patient">Patients Only</option>
                  <option value="doctor">Doctors Only</option>
                  <option value="admin">Administrators Only</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loader message="Loading directory profiles..." />
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <FaUsers className="fs-1 text-muted mb-3" />
                <p className="text-muted m-0">No users found matching parameters.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Profile Details</th>
                      <th>Contact Email / Phone</th>
                      <th>System Role</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(usr => (
                      <tr key={usr._id}>
                        <td>
                          <div className="fw-bold text-dark">{usr.name}</div>
                          <span className="text-muted text-xs">
                            {usr.gender || 'N/A'} | Age: {usr.age || 'N/A'} Yrs
                          </span>
                        </td>
                        <td>
                          <div>{usr.email}</div>
                          <span className="text-muted text-xs">{usr.phone}</span>
                        </td>
                        <td>
                          <span className={`badge px-3 py-1.5 rounded-pill text-xs fw-semibold text-capitalize ${usr.role === 'admin' ? 'bg-danger-subtle text-danger' : usr.role === 'doctor' ? 'bg-info-subtle text-info' : 'bg-success-subtle text-success'}`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="text-sm">
                          {new Date(usr.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
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

export default Users;
