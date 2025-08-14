
import React from 'react';
import { ToggleContainer, ToggleButton } from './ViewToggle.styled.js';

const VIEWS = [
    { id: 'cards', label: 'Cards' },
    { id: 'research', label: 'Research' },
    { id: 'stats', label: 'Stats' }
];

export const ViewToggle = ({ currentView, onViewChange }) => {
    return (
        <ToggleContainer>
            {VIEWS.map(view => (
                <ToggleButton
                    key={view.id}
                    $active={currentView === view.id}
                    onClick={() => onViewChange(view.id)}
                >
                    {view.label}
                </ToggleButton>
            ))}
        </ToggleContainer>
    );
};
