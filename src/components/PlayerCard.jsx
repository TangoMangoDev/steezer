
import React from 'react';
import { POSITION_KEY_STATS } from '../config/statsConfig.js';
import { FormatUtils } from '../utils/formatUtils.js';

export const PlayerCard = ({ 
    player, 
    showFantasyStats, 
    onPlayerClick, 
    getStatValue, 
    calculateTotalFantasyPoints 
}) => {
    const stats = POSITION_KEY_STATS[player.position] || [];
    const totalFantasyPoints = player.fantasyPoints || calculateTotalFantasyPoints(player);

    const handleClick = () => {
        onPlayerClick(player.id);
    };

    return (
        <div 
            onClick={handleClick}
            style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ':hover': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }
            }}
        >
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                    {player.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}>
                        {player.position}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{player.team}</span>
                    {showFantasyStats && totalFantasyPoints > 0 && (
                        <span style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                            {totalFantasyPoints} pts
                        </span>
                    )}
                    {showFantasyStats && player.overallRank && (
                        <span style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                            Overall: #{player.overallRank}
                        </span>
                    )}
                    {showFantasyStats && player.positionRank && (
                        <span style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                            {player.position}: #{player.positionRank}
                        </span>
                    )}
                </div>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem'
            }}>
                {stats.map(stat => {
                    const rawValue = player.stats[stat] || 0;
                    const displayValue = getStatValue(player, stat);
                    const isFantasyMode = showFantasyStats && displayValue !== rawValue && displayValue > 0;

                    return (
                        <div key={stat} style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: isFantasyMode ? '#10b981' : 'white',
                                marginBottom: '0.25rem'
                            }}>
                                {FormatUtils.formatStatValue(displayValue, stat, isFantasyMode)}
                            </div>
                            <div style={{
                                fontSize: '0.875rem',
                                color: 'rgba(255, 255, 255, 0.6)'
                            }}>
                                {stat}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
