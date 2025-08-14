
import React from 'react';
import { ViewToggleContainer, ViewButton } from './ViewToggle.styled.js';

const VIEWS = [
    { id: 'cards', label: 'Cards' },
    { id: 'research', label: 'Research' },
    { id: 'stats', label: 'Stats' }
];

export const ViewToggle = ({ currentView, onViewChange }) => {
    return (
        <ViewToggleContainer>
            {VIEWS.map(view => (
                <ViewButton
                    key={view.id}
                    active={currentView === view.id}
                    onClick={() => onViewChange(view.id)}
                >
                    {view.label}
                </ViewButton>
            ))}
        </ViewToggleContainer>
    );
};
