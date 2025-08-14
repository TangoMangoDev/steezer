// src/components/ViewControls.jsx
import React from 'react';

const ViewControls = ({ currentView, onViewChange }) => {
  return (
    <div className="view-toggle">
      <button
        className={`view-btn ${currentView === 'cards' ? 'active' : ''}`}
        onClick={() => onViewChange('cards')}
      >
        Cards
      </button>
      <button
        className={`view-btn ${currentView === 'research' ? 'active' : ''}`}
        onClick={() => onViewChange('research')}
      >
        Research
      </button>
      <button
        className={`view-btn ${currentView === 'stats' ? 'active' : ''}`}
        onClick={() => onViewChange('stats')}
      >
        Stats
      </button>
    </div>
  );
};

export default ViewControls;