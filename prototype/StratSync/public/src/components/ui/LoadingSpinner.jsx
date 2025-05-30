import React from 'react';
import '../../assets/styles/globals.css';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`loading-container ${fullPage ? 'full-page' : ''}`}>
      <div className="loading-spinner"></div>
      <p>Cargando...</p>
    </div>
  );
};

export default LoadingSpinner;