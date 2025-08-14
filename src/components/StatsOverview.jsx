import React from 'react';
import { DataUtils } from '../utils/dataUtils.js';
import { FormatUtils } from '../utils/formatUtils.js';

export const StatsOverview = ({ 
    players, 
    currentFilters,
    showFantasyStats, 
    getStatValue 
}) => {
    const stats = DataUtils.getStatsForPosition(currentFilters.position);
    const statCategories = DataUtils.categorizeStats(stats);

    const getStatLeaders = (stat, limit = 3) => {
        return DataUtils.getStatLeaders(players, stat, limit, showFantasyStats, getStatValue);
    };

    return (
        <div className="stats-overview fade-in">
            <h2>Leaders {showFantasyStats ? '(Fantasy Points)' : '(Raw Stats)'}</h2>
            {Object.entries(statCategories).map(([category, categoryStats]) => (
                <div key={category} className="stat-category">
                    <div className="stat-category-title">{category}</div>
                    {categoryStats.map(stat => {
                        const leaders = getStatLeaders(stat, 3);
                        return (
                            <div key={stat} className="stat-row">
                                <span>{stat}</span>
                                <span>
                                    {leaders.map(l => {
                                        const displayValue = showFantasyStats ? 
                                            getStatValue({stats: {[stat]: l.value}}, stat) : l.value;
                                        const suffix = showFantasyStats && displayValue !== l.value && displayValue > 0 ? ' pts' : '';
                                        return `${l.name} (${FormatUtils.formatStatValue(displayValue, stat, showFantasyStats && displayValue !== l.value)}${suffix})`;
                                    }).join(', ')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};