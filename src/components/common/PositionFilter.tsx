import React from 'react';
import './PositionFilter.css';

interface PositionFilterProps {
  positions: string[];
  activePosition: string;
  onChange: (position: string) => void;
}

const PositionFilter: React.FC<PositionFilterProps> = ({
  positions,
  activePosition,
  onChange
}) => {
  return (
    <div className="position-filter">
      {positions.map(position => (
        <button
          key={position}
          className={`position-btn ${activePosition === position ? 'active' : ''}`}
          onClick={() => onChange(position)}
        >
          {position}
        </button>
      ))}
    </div>
  );
};

export default PositionFilter;