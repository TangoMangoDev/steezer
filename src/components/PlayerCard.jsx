import React from 'react';
import { STATS_CONFIG } from '../config/statsConfig.js';
import { FormatUtils } from '../utils/formatUtils.js';

export const PlayerCard = ({ 
    player, 
    showFantasyStats, 
    onPlayerClick, 
    getStatValue, 
    calculateTotalFantasyPoints 
}) => {
    const stats = STATS_CONFIG.POSITION_KEY_STATS[player.position] || [];
    const totalFantasyPoints = player.fantasyPoints || calculateTotalFantasyPoints(player);

    const handleClick = () => {
        onPlayerClick(player.id);
    };

    return (
        <div className="player-card fade-in" onClick={handleClick}>
            <div className="player-header">
                <div className="player-info">
                    <h3>{player.name}</h3>
                    <div className="player-meta">
                        <span className="position-badge">{player.position}</span>
                        <span>{player.team}</span>
                        {showFantasyStats && totalFantasyPoints > 0 && (
                            <span className="fantasy-total">{totalFantasyPoints} pts</span>
                        )}
                        {showFantasyStats && player.overallRank && (
                            <span className="rank-badge">Overall: #{player.overallRank}</span>
                        )}
                        {showFantasyStats && player.positionRank && (
                            <span className="position-rank-badge">{player.position}: #{player.positionRank}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="stat-grid">
                {stats.map(stat => {
                    const rawValue = player.stats[stat] || 0;
                    const displayValue = getStatValue(player, stat);
                    const isFantasyMode = showFantasyStats && displayValue !== rawValue && displayValue > 0;

                    return (
                        <div key={stat} className="stat-item">
                            <span className={`stat-value ${isFantasyMode ? 'fantasy-points' : ''}`}>
                                {FormatUtils.formatStatValue(displayValue, stat, isFantasyMode)}
                            </span>
                            <span className="stat-label">{stat}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};