// src/components/common/WeekSelector.tsx
import React from 'react';

interface WeekSelectorProps {
  value: string;
  onChange: (week: string) => void;
  weeks: string[];
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ value, onChange, weeks }) => {
  return (
    <div className="week-selector">
      <label htmlFor="week-select">Week:</label>
      <select 
        id="week-select"
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="week-select"
      >
        {weeks.map(week => (
          <option key={week} value={week}>
            {week === 'total' ? 'Season Total' : `Week ${week}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WeekSelector;