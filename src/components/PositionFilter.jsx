
import React from 'react';
import { PositionFilterContainer, PositionButton } from './PositionFilter.styled.js';

export const PositionFilter = ({ currentPosition, onPositionChange }) => {
    const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

    return (
        <PositionFilterContainer>
            {positions.map(position => (
                <PositionButton
                    key={position}
                    active={currentPosition === position}
                    onClick={() => onPositionChange(position)}
                >
                    {position}
                </PositionButton>
            ))}
        </PositionFilterContainer>
    );
};
