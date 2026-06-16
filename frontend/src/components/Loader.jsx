import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '200px' }}>
      <div className="spinner-border text-teal" role="status" style={{ width: '3rem', height: '3rem', color: '#0d9488' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-medium">{message}</p>
    </div>
  );
};

export default Loader;
