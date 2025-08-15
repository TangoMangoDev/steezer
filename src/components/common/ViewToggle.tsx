import React from 'react';
import './ViewToggle.css';

interface ViewToggleProps {
  views: string[];
  activeView: string;
  onChange: (view: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  views,
  activeView,
  onChange
}) => {
  return (
    <div className="view-toggle">
      {views.map(view => (
        <button
          key={view}
          className={`view-btn ${activeView === view ? 'active' : ''}`}
          onClick={() => onChange(view)}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;