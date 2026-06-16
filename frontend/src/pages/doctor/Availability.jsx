import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';
import { AuthContext } from '../../context/AuthContext';
import { FaClock, FaCalendarDays } from 'react-icons/fa6';

const availableDaysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const availableSlotsList = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const Availability = () => {
  const { doctorProfile, updateAvailability } = useContext(AuthContext);
  const [sidebarActive, setSidebarActive] = useState(false);

  const [selectedDays, setSelectedDays] = useState(doctorProfile?.availability?.days || []);
  const [selectedSlots, setSelectedSlots] = useState(doctorProfile?.availability?.slots || []);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync state if doctorProfile updates
  useEffect(() => {
    if (doctorProfile?.availability) {
      setSelectedDays(doctorProfile.availability.days || []);
      setSelectedSlots(doctorProfile.availability.slots || []);
    }
  }, [doctorProfile]);

  const handleDayChange = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSlotChange = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      setToast({ message: 'Please select at least one active working day', type: 'error' });
      return;
    }
    if (selectedSlots.length === 0) {
      setToast({ message: 'Please select at least one active consulting slot', type: 'error' });
      return;
    }

    setLoading(true);
    const result = await updateAvailability(selectedDays, selectedSlots);
    if (result.success) {
      setToast({ message: 'Clinic availability schedule updated successfully!', type: 'success' });
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
            <h2 className="fw-bold m-0 text-dark">Consulting Availability</h2>
            <p className="text-muted m-0">Set working days and hourly consultation timeslots for patients booking.</p>
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ maxWidth: '750px' }}>
            <form onSubmit={handleSubmit}>
              
              {/* Working Days */}
              <div className="mb-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                  <FaCalendarDays className="text-teal" style={{ color: '#0d9488' }} /> Clinical Working Days
                </h5>
                <div className="d-flex flex-wrap gap-2.5">
                  {availableDaysList.map(day => {
                    const isChecked = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayChange(day)}
                        className={`slot-button ${isChecked ? 'selected' : ''}`}
                        style={{ padding: '8px 16px', borderRadius: '20px' }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Working Time Slots */}
              <div className="mb-4 pt-3 border-top">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                  <FaClock className="text-teal" style={{ color: '#0d9488' }} /> Consult Time Slots
                </h5>
                <div className="d-flex flex-wrap gap-2.5">
                  {availableSlotsList.map(slot => {
                    const isChecked = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSlotChange(slot)}
                        className={`slot-button ${isChecked ? 'selected' : ''}`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-teal text-white w-100 py-3 fw-bold mt-3"
                style={{ backgroundColor: '#0d9488', borderRadius: '8px' }}
              >
                {loading ? 'Saving schedules...' : 'Save Availability Settings'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
