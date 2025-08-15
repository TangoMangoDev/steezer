import React from 'react';
import './ViewToggle.css';
import { ViewMode } from '@types/ui';

interface ViewToggleProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  views,
  currentView,
  onChange
}) => {
  return (
    <div className="view-toggle">
      {views.map(view => (
        <button
          key={view}
          className={`view-btn ${currentView === view ? 'active' : ''}`}
          onClick={() => onChange(view as ViewMode)}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;