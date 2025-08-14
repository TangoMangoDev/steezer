// src/components/LoadingSpinner.jsx
import React from 'react';

export const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading fantasy data...</p>
  </div>
);

export const ErrorDisplay = ({ error, onRetry }) => (
  <div className="error-container">
    <h3>Error Loading Data</h3>
    <p>{error}</p>
    <button onClick={onRetry} className="retry-btn">
      Try Again
    </button>
  </div>
);