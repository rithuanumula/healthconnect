import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#d1fae5' : '#fee2e2';
  const textColor = type === 'success' ? '#065f46' : '#991b1b';
  const borderColor = type === 'success' ? '#a7f3d0' : '#fecaca';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '12px 20px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        animation: 'fadeInUp 0.3s ease'
      }}
    >
      <span className="fw-medium">{message}</span>
      <button
        onClick={onClose}
        style={{
          border: 'none',
          background: 'none',
          color: textColor,
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: 0,
          fontSize: '1.2rem',
          lineHeight: 1
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
