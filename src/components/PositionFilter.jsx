import React from 'react';
import { PositionFilterContainer, PositionButton } from './PositionFilter.styled.js';

const POSITIONS = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST', 'LB', 'CB', 'S', 'DE', 'DT'];

export const PositionFilter = ({ currentPosition, onPositionChange }) => {
    return (
        <PositionFilterContainer>
            {POSITIONS.map(position => (
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