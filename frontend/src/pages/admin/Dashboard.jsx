import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import {
  FaUsers,
  FaUserDoctor,
  FaCalendarCheck,
  FaIndianRupeeSign,
  FaCircleCheck,
  FaHourglassHalf
} from 'react-icons/fa6';
import api from '../../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
        console.error('Error loading admin analytics:', err);
        setToast({ message: 'Failed to load system analytics', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar active={sidebarActive} toggleSidebar={toggleSidebar} />
        <div className="dashboard-content d-flex flex-column">
          <Navbar toggleSidebar={toggleSidebar} isDashboard={true} />
          <Loader message="Loading system-wide analytics..." />
        </div>
      </div>
    );
  }

  // Set up chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Earnings (INR, ₹)',
        data: analytics?.financials?.monthlyRevenue || Array(12).fill(0),
        backgroundColor: '#0d9488',
        borderRadius: 6
      }
    ]
  };

  const statusChartData = {
    labels: ['Scheduled', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          analytics?.appointmentStatus?.scheduled || 0,
          analytics?.appointmentStatus?.completed || 0,
          analytics?.appointmentStatus?.cancelled || 0
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
        borderWidth: 1
      }
    ]
  };

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
            <h2 className="fw-bold m-0 text-dark">System Administration</h2>
            <p className="text-muted m-0">Consolidated overview of platform usage, clinician verifications, and revenues.</p>
          </div>

          {/* Counts Row */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Total Registered</span>
                    <h3 className="fw-bold m-0 text-dark">{analytics?.counts?.totalUsers || 0}</h3>
                  </div>
                  <div className="bg-light p-3 rounded-3 text-secondary">
                    <FaUsers className="fs-4" />
                  </div>
                </div>
                <div className="text-xs text-muted mt-2">
                  Patients: {analytics?.counts?.totalPatients} | Doctors: {analytics?.counts?.totalDoctors}
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Total Consults</span>
                    <h3 className="fw-bold m-0 text-dark">{analytics?.counts?.totalAppointments || 0}</h3>
                  </div>
                  <div className="bg-primary-light text-teal p-3 rounded-3" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
                    <FaCalendarCheck className="fs-4" />
                  </div>
                </div>
                <div className="text-xs text-muted mt-2">
                  Completed: {analytics?.appointmentStatus?.completed} | Cancelled: {analytics?.appointmentStatus?.cancelled}
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Pending Verify</span>
                    <h3 className="fw-bold m-0 text-dark">{analytics?.counts?.pendingDoctors || 0}</h3>
                  </div>
                  <div className="bg-warning-subtle text-warning p-3 rounded-3">
                    <FaHourglassHalf className="fs-4" />
                  </div>
                </div>
                <div className="text-xs text-muted mt-2">
                  Approved Clinicians: {analytics?.counts?.approvedDoctors}
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card metric-card bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted text-sm fw-medium d-block mb-1">Total Platform Sales</span>
                    <h3 className="fw-bold m-0 text-dark">₹{analytics?.financials?.totalRevenue || 0}</h3>
                  </div>
                  <div className="bg-success-subtle text-success p-3 rounded-3">
                    <FaIndianRupeeSign className="fs-4" />
                  </div>
                </div>
                <div className="text-xs text-success mt-2">
                  Completed invoice payments
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="row g-4 mb-4">
            {/* Revenue chart */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                <h5 className="fw-bold mb-3 text-dark">Revenue Stream (Completed Consultations)</h5>
                <div style={{ position: 'relative', height: '300px' }}>
                  <Bar
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Doughnut status distribution chart */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                <h5 className="fw-bold mb-3 text-dark">Appointment Status</h5>
                <div style={{ position: 'relative', height: '240px' }} className="d-flex align-items-center justify-content-center">
                  <Doughnut
                    data={statusChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category distribution and details */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                <h5 className="fw-bold mb-3 text-dark">Approved Specialists Distribution</h5>
                
                {analytics?.specializations?.length === 0 ? (
                  <p className="text-muted text-sm m-0">No approved specialist records found.</p>
                ) : (
                  <div className="row row-cols-2 row-cols-md-4 g-3 mt-1">
                    {analytics?.specializations?.map(spec => (
                      <div key={spec._id} className="col">
                        <div className="p-3 bg-light rounded-3 text-center h-100">
                          <span className="text-muted text-xs d-block mb-1 text-uppercase fw-semibold">{spec._id}</span>
                          <h4 className="fw-bold text-teal m-0" style={{ color: '#0d9488' }}>{spec.count}</h4>
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

export default Dashboard;
