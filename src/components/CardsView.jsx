// src/components/CardsView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS

const CardsView = ({ 
  players, 
  showFantasyStats, 
  scoringRules,
  statsAPI,
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  const navigate = useNavigate(); // ADD THIS

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

  const getStatsForPosition = (position) => {
    if (!statsAPI) return [];
    return statsAPI.getPositionStats(position);
  };

  // FIX: Use React Router navigation
  const navigateToPlayer = (playerId) => {
    navigate(`/stats/player/${playerId}`);
  };

  return (
    <div className="cards-grid fade-in">
      {players.map((player, index) => {
        const stats = getStatsForPosition(player.position);
        const totalFantasyPoints = showFantasyStats ? (player.fantasyPoints || 0) : 0;

        return (
          <div
            key={`${player.playerId}-${index}`}
            className="player-card"
            onClick={() => navigateToPlayer(player.playerId || player.id)}
          >
            {/* Rest of your card content stays the same */}
            <div className="player-header">
              <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-meta">
                  <span className="position">{player.position}</span>
                  <span className="team">{player.team}</span>
                </div>
                {showFantasyStats && totalFantasyPoints > 0 && (
                  <div className="fantasy-total">{totalFantasyPoints} pts</div>
                )}
                {showFantasyStats && player.overallRank && (
                  <span className="rank-badge">Overall: #{player.overallRank}</span>
                )}
                {showFantasyStats && player.positionRank && (
                  <span className="position-rank-badge">
                    {player.position}: #{player.positionRank}
                  </span>
                )}
              </div>
            </div>
            <div className="stat-grid">
              {stats.slice(0, 6).map(stat => {
                const rawValue = player.stats?.[stat] || 0;
                const displayValue = getStatValue(player, stat);
                const isFantasyMode = showFantasyStats && displayValue !== rawValue && displayValue > 0;

                return (
                  <div key={stat} className="stat-item">
                    <span className={`stat-value ${isFantasyMode ? 'fantasy-points' : ''}`}>
                      {formatStatValue(displayValue, stat, isFantasyMode)}
                    </span>
                    <span className="stat-label">{stat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Players'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CardsView;