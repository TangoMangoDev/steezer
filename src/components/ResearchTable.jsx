import React from 'react';
import { DataUtils } from '../utils/dataUtils.js';

export const ResearchTable = ({ 
    players, 
    currentFilters,
    showFantasyStats, 
    onSort, 
    onPlayerClick,
    onLoadMore,
    hasMore,
    getStatValue,
    calculateTotalFantasyPoints
}) => {
    const allStats = DataUtils.getStatsForPosition(currentFilters.position);
    const visibleStats = DataUtils.getVisibleStats(players, allStats);

    const handleHeaderClick = (column) => {
        onSort(column);
    };

    const handlePlayerClick = (playerId) => {
        onPlayerClick(playerId);
    };

    const handleLoadMore = () => {
        if (hasMore) {
            onLoadMore();
        }
    };

    return (
        <div className="research-container fade-in">
            <div className="research-header">
                <h2>Research Table - {showFantasyStats ? 'Fantasy Points' : 'Raw Stats'}</h2>
                <div className="research-controls">
                    <span className="player-count">Showing {players.length} players</span>
                    {hasMore && (
                        <button 
                            onClick={handleLoadMore}
                            className="clear-filters-btn"
                        >
                            Load More Players
                        </button>
                    )}
                </div>
            </div>
            <div className="research-table-wrapper">
                <table className="research-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleHeaderClick('overallRank')}>Overall Rank</th>
                            <th onClick={() => handleHeaderClick('positionRank')}>Pos Rank</th>
                            <th onClick={() => handleHeaderClick('name')}>Player</th>
                            {showFantasyStats && (
                                <th onClick={() => handleHeaderClick('fantasyPoints')}>Total Fantasy Pts</th>
                            )}
                            {visibleStats.map(stat => (
                                <th key={stat} onClick={() => handleHeaderClick(stat)}>
                                    {stat}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => (
                            <tr 
                                key={player.id} 
                                onClick={() => handlePlayerClick(player.id)}
                            >
                                <td>#{player.overallRank || '-'}</td>
                                <td>#{player.positionRank || '-'}</td>
                                <td>{player.name}</td>
                                {showFantasyStats && (
                                    <td>{calculateTotalFantasyPoints(player)} pts</td>
                                )}
                                {visibleStats.map(stat => {
                                    const value = showFantasyStats ? 
                                        getStatValue(player, stat) : 
                                        (player.stats[stat] || 0);
                                    return <td key={stat}>{value}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};