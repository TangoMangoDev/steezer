// src/components/StatsView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';


const StatsView = ({ 
  players, 
  showFantasyStats, 
  scoringRules,
  statsAPI,
  currentPosition 
}) => {
  const getStatsForPosition = (position) => {
    if (!statsAPI) return [];
    return statsAPI.getPositionStats(position);
  };

  const categorizeStats = (stats) => {
    if (!statsAPI) return {};
    return statsAPI.categorizeStats(stats);
  };

  const getStatLeaders = (players, stat, limit = 5) => {
    return players
      .map(player => ({
        ...player,
        value: showFantasyStats && statsAPI ? 
          statsAPI.getStatValue(player, stat, scoringRules) :
          (player.stats?.[stat] || 0)
      }))
      .filter(player => player.value > 0)
      .sort((a, b) => {
        if (stat.includes('Miss') || stat.includes('Allow') || stat === 'Int' || stat === 'Fum') {
          return a.value - b.value;
        }
        return b.value - a.value;
      })
      .slice(0, limit);
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

  const stats = getStatsForPosition(currentPosition);
  const statCategories = categorizeStats(stats);
  const navigate = useNavigate();

  const navigateToPlayer = (playerId) => {
    navigate(`/stats/player/${playerId}`);
  };
  return (
    <div className="stats-overview fade-in">
      <h2>Leaders {showFantasyStats ? '(Fantasy Points)' : '(Raw Stats)'}</h2>
      {Object.entries(statCategories).map(([category, categoryStats]) => {
        if (categoryStats.length === 0) return null;

        return (
          <div key={category} className="stat-category">
            <div className="stat-category-title">{category}</div>
            {categoryStats.map(stat => {
              const leaders = getStatLeaders(players, stat, 3);
              if (leaders.length === 0) return null;

              return (
                <div key={stat} className="stat-row">
                  <span className="stat-name">{stat}</span>
                  <span className="stat-leaders">
                    {leaders.map((leader, index) => (
                      <span
                        key={leader.playerId || leader.id}
                        className="leader-item"
                        onClick={() => navigateToPlayer(leader.playerId || leader.id)}
                      >
                        {index > 0 && ', '}
                        <strong>{leader.name}</strong> ({formatStatValue(leader.value, stat)})
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default StatsView;