
import React from 'react';
import { DataUtils } from '../utils/dataUtils.js';

export const StatsOverview = ({ 
    players, 
    currentFilters, 
    showFantasyStats, 
    getStatValue 
}) => {
    const stats = DataUtils.getStatsForPosition(currentFilters.position);
    const statCategories = categorizeStats(stats);

    function categorizeStats(stats) {
        const categories = {
            "Passing": ["Pass Att", "Comp", "Inc", "Pass Yds", "Pass TD", "Int", "Sack"],
            "Rushing": ["Rush Att", "Rush Yds", "Rush TD"],
            "Receiving": ["Rec", "Rec Yds", "Rec TD", "Targets"],
            "Kicking": ["FG 0-19", "FG 20-29", "FG 30-39", "FG 40-49", "FG 50+", "PAT Made", "PAT Miss"],
            "Defense": ["Tack Solo", "Tack Ast", "Pass Def", "Sack", "Int", "Fum Rec", "Fum Force", "TD", "Safe", "Blk Kick"],
            "Special Teams": ["Ret Yds", "Ret TD"],
            "Team Defense": ["Pts Allow 0", "Pts Allow 1-6", "Pts Allow 7-13", "Pts Allow 14-20", "Pts Allow 21-27", "Pts Allow 28-34", "Pts Allow 35+"],
            "Turnovers": ["Fum", "Fum Lost"]
        };

        const result = {};
        stats.forEach(stat => {
            for (const [category, categoryStats] of Object.entries(categories)) {
                if (categoryStats.includes(stat)) {
                    if (!result[category]) result[category] = [];
                    result[category].push(stat);
                    break;
                }
            }
        });
        return result;
    }

    function getStatLeaders(players, stat, limit = 3) {
        return players
            .filter(p => p.stats[stat] !== undefined && p.stats[stat] > 0)
            .map(p => ({ 
                name: p.name, 
                value: p.stats[stat] || 0,
                rawStats: p.rawStats
            }))
            .sort((a, b) => {
                const aValue = showFantasyStats ? getStatValue({stats: {[stat]: a.value}}, stat) : a.value;
                const bValue = showFantasyStats ? getStatValue({stats: {[stat]: b.value}}, stat) : b.value;

                if (stat.includes('Miss') || stat.includes('Allow') || stat === 'Int' || stat === 'Fum') {
                    return aValue - bValue;
                }
                return bValue - aValue;
            })
            .slice(0, limit);
    }

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '2rem',
            animation: 'fadeIn 0.5s ease-in'
        }}>
            <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '2rem', 
                color: 'white' 
            }}>
                Leaders {showFantasyStats ? '(Fantasy Points)' : '(Raw Stats)'}
            </h2>
            {Object.entries(statCategories).map(([category, categoryStats]) => (
                <div key={category} style={{ marginBottom: '2rem' }}>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#3b82f6',
                        borderBottom: '2px solid #3b82f6',
                        paddingBottom: '0.5rem'
                    }}>
                        {category}
                    </div>
                    {categoryStats.map(stat => {
                        const leaders = getStatLeaders(players, stat, 3);
                        return (
                            <div key={stat} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <span style={{ 
                                    fontWeight: '500',
                                    color: 'white',
                                    minWidth: '120px'
                                }}>
                                    {stat}
                                </span>
                                <span style={{ 
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    flex: 1,
                                    textAlign: 'right'
                                }}>
                                    {leaders.map(l => {
                                        const displayValue = showFantasyStats ? 
                                            getStatValue({stats: {[stat]: l.value}}, stat) : l.value;
                                        const suffix = showFantasyStats && displayValue !== l.value && displayValue > 0 ? ' pts' : '';
                                        return `${l.name} (${displayValue}${suffix})`;
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
