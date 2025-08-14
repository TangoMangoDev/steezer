
import React from 'react';
import { ViewToggleContainer, ViewButton } from './ViewToggle.styled.js';

export const ViewToggle = ({ currentView, onViewChange }) => {
    const views = [
        { key: 'cards', label: 'Cards' },
        { key: 'research', label: 'Research' },
        { key: 'stats', label: 'Stats' }
    ];

    return (
        <ViewToggleContainer>
            {views.map(view => (
                <ViewButton
                    key={view.key}
                    active={currentView === view.key}
                    onClick={() => onViewChange(view.key)}
                >
                    {view.label}
                </ViewButton>
            ))}
        </ViewToggleContainer>
    );
};
