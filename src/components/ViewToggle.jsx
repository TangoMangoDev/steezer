
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
