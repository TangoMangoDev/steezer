// src/components/AppHeader.jsx
import React from 'react';

const AppHeader = ({ 
  showFantasyStats, 
  onToggleStatsMode, 
  currentFilters, 
  onPositionFilter, 
  onSearchFilter 
}) => {
  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST', 'LB', 'CB', 'S', 'DE', 'DT'];

  return (
    <div className="header">
      <h1>Fantasy Football Dashboard</h1>

      <div className="filter-controls-container">
        <div className="filter-controls">
          <div className="toggle-container">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={showFantasyStats}
                onChange={onToggleStatsMode}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">
              {showFantasyStats ? 'Fantasy Points' : 'Raw Stats'}
            </span>
          </div>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search players..."
              value={currentFilters.search}
              onChange={(e) => onSearchFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="position-filter">
        {positions.map(position => (
          <button
            key={position}
            className={`position-btn ${currentFilters.position === position ? 'active' : ''}`}
            onClick={() => onPositionFilter(position)}
          >
            {position}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppHeader;