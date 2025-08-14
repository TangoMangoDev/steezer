import React from 'react';

export const ViewToggle = ({ currentView, onViewChange }) => {
    const views = [
        { key: 'cards', label: 'Cards' },
        { key: 'research', label: 'Research' },
        { key: 'stats', label: 'Stats' }
    ];

    const handleViewClick = (view) => {
        if (view !== currentView) {
            onViewChange(view);
        }
    };

    return (
        <div className="view-toggle">
            {views.map(view => (
                <button
                    key={view.key}
                    className={`view-btn ${currentView === view.key ? 'active' : ''}`}
                    onClick={() => handleViewClick(view.key)}
                >
                    {view.label}
                </button>
            ))}
        </div>
    );
};