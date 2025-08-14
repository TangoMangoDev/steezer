// src/components/ResearchView.jsx
import React from 'react';

const ResearchView = ({ 
  players, 
  showFantasyStats, 
  scoringRules,
  statsAPI,
  sortConfig, 
  onSort, 
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  const getVisibleStats = (players, allStats) => {
    return allStats.filter(stat => 
      players.some(player => (player.stats?.[stat] || 0) > 0)
    );
  };

  const getStatsForPosition = (position) => {
    if (!statsAPI) return [];
    return statsAPI.getPositionStats(position);
  };

  const getStatValue = (player, stat) => {
    if (showFantasyStats && statsAPI) {
      return statsAPI.getStatValue(player, stat, scoringRules);
    }
    return player.stats?.[stat] || 0;
  };

  const formatStatValue = (value, stat) => {
    if (showFantasyStats && value > 0) {
      return `${value} pts`;
    }

    if (typeof value === 'number' && value % 1 !== 0) {
      return value.toFixed(1);
    }

    return value.toString();
  };

  const navigateToPlayer = (playerId) => {
    window.location.href = `player.html?id=${encodeURIComponent(playerId)}`;
  };

  const allStats = getStatsForPosition('ALL');
  const visibleStats = getVisibleStats(players, allStats);

  return (
    <div className="research-container fade-in">
      <div className="research-header">
        <h2>Research Table - {showFantasyStats ? 'Fantasy Points' : 'Raw Stats'}</h2>
        <div className="research-controls">
          <span className="player-count">Showing {players.length} players</span>
          {hasMore && (
            <button
              className="clear-filters-btn"
              onClick={onLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Players'}
            </button>
          )}
        </div>
      </div>

      <div className="research-table-wrapper">
        <table className="research-table">
          <thead>
            <tr>
              <th onClick={() => onSort('overallRank')}>
                Overall Rank
                {sortConfig.column === 'overallRank' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => onSort('positionRank')}>
                Pos Rank
                {sortConfig.column === 'positionRank' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => onSort('name')}>
                Player
                {sortConfig.column === 'name' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              {showFantasyStats && (
                <th onClick={() => onSort('fantasyPoints')}>
                  Fantasy Points
                  {sortConfig.column === 'fantasyPoints' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              )}
              {visibleStats.slice(0, 10).map(stat => (
                <th key={stat} onClick={() => onSort(stat)}>
                  {stat}
                  {sortConfig.column === stat && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={`${player.playerId || player.id}-${index}`}
                onClick={() => navigateToPlayer(player.playerId || player.id)}
                style={{ cursor: 'pointer' }}
                className="research-row"
              >
                <td>#{player.overallRank || '—'}</td>
                <td>#{player.positionRank || '—'}</td>
                <td>
                  <div>
                    <strong>{player.name}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {player.position} - {player.team}
                    </div>
                  </div>
                </td>
                {showFantasyStats && (
                  <td>{formatStatValue(player.fantasyPoints || 0, 'fantasyPoints')}</td>
                )}
                {visibleStats.slice(0, 10).map(stat => {
                  const value = getStatValue(player, stat);
                  return (
                    <td key={stat}>
                      {formatStatValue(value, stat)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResearchView;