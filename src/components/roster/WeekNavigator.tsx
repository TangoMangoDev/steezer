// src/components/roster/WeekNavigator.tsx
import React from 'react';

interface WeekNavigatorProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
  maxWeek: number;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({ 
  currentWeek, 
  onWeekChange, 
  maxWeek 
}) => {
  const handlePrevious = () => {
    if (currentWeek > 1) {
      onWeekChange(currentWeek - 1);
    }
  };

  const handleNext = () => {
    if (currentWeek < maxWeek) {
      onWeekChange(currentWeek + 1);
    }
  };

  return (
    <div className="week-navigator">
      <button 
        onClick={handlePrevious}
        disabled={currentWeek <= 1}
        className="nav-btn"
      >
        ← Previous
      </button>

      <span className="current-week">Week {currentWeek}</span>

      <button 
        onClick={handleNext}
        disabled={currentWeek >= maxWeek}
        className="nav-btn"
      >
        Next →
      </button>
    </div>
  );
};

export default WeekNavigator;