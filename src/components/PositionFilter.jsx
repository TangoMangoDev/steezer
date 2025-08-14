import React from 'react';
import { FilterContainer, FilterButton } from './PositionFilter.styled.js';

const POSITIONS = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST', 'LB', 'CB', 'S', 'DE', 'DT'];

export const PositionFilter = ({ currentPosition, onPositionChange }) => {
    return (
        <FilterContainer>
            {POSITIONS.map(position => (
                <FilterButton
                    key={position}
                    $active={currentPosition === position}
                    onClick={() => onPositionChange(position)}
                >
                    {position}
                </FilterButton>
            ))}
        </FilterContainer>
    );
};