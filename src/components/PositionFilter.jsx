import React from 'react';

export const PositionFilter = ({ currentPosition, onPositionChange }) => {
    const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST', 'LB', 'CB', 'S', 'DE', 'DT'];

    const handlePositionClick = (position) => {
        if (position !== currentPosition) {
            onPositionChange(position);
        }
    };

    return (
        <div className="position-filter" id="positionFilter">
            {positions.map(position => (
                <button
                    key={position}
                    className={`position-btn ${currentPosition === position ? 'active' : ''}`}
                    onClick={() => handlePositionClick(position)}
                >
                    {position}
                </button>
            ))}
        </div>
    );
};