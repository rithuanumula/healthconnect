import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on start
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          if (res.data.doctorProfile) {
            setDoctorProfile(res.data.doctorProfile);
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth verification failed', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        if (res.data.doctorProfile) {
          setDoctorProfile(res.data.doctorProfile);
        } else {
          setDoctorProfile(null);
        }
        return { success: true, user: res.data.user };
      }
      return { success: false, message: 'Invalid response' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        if (res.data.doctorProfile) {
          setDoctorProfile(res.data.doctorProfile);
        } else {
          setDoctorProfile(null);
        }
        return { success: true, user: res.data.user };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDoctorProfile(null);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/update', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: 'Update failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed'
      };
    }
  };

  // Update doctor profile (doctor specific)
  const updateDoctor = async (doctorData) => {
    try {
      const res = await api.put('/doctors/profile', doctorData);
      if (res.data.success) {
        setDoctorProfile(res.data.data);
        if (res.data.data.userId) {
          setUser(res.data.data.userId);
        }
        return { success: true };
      }
      return { success: false, message: 'Update failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed'
      };
    }
  };

  // Update doctor availability
  const updateAvailability = async (days, slots) => {
    try {
      const res = await api.put('/doctors/availability', { days, slots });
      if (res.data.success) {
        setDoctorProfile(res.data.data);
        return { success: true };
      }
      return { success: false, message: 'Availability update failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        doctorProfile,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateDoctor,
        updateAvailability
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
