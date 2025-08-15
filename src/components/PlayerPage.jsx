// src/components/PlayerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatsAPI from '../utils/statsAPI';
import LoadingSpinner from './LoadingSpinner';
import './PlayerPage.css';

const PlayerPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsAPI] = useState(() => new StatsAPI());
  const [viewMode, setViewMode] = useState('raw'); // 'raw' or 'fantasy'
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedWeek, setSelectedWeek] = useState('ALL');

  useEffect(() => {
    if (playerId) {
      loadPlayerData();
    }
  }, [playerId, selectedYear, selectedWeek]);

  const loadPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load player info and stats
      await statsAPI.initialize();
      const allPlayers = await statsAPI.getAllPlayers();
      const foundPlayer = allPlayers.find(p => 
        (p.playerId || p.id) === playerId
      );

      if (!foundPlayer) {
        throw new Error('Player not found');
      }

      setPlayer(foundPlayer);

      // Load detailed player stats for different weeks
      const detailedStats = await statsAPI.getPlayerDetailedStats(playerId, {
        year: selectedYear,
        week: selectedWeek
      });

      setPlayerStats(detailedStats);
    } catch (err) {
      console.error('Error loading player:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatStatValue = (value, stat) => {
    if (viewMode === 'fantasy' && value > 0) {
      return `${value} pts`;
    }
    if (typeof value === 'number' && value % 1 !== 0) {
      return value.toFixed(1);
    }
    return value?.toString() || '0';
  };

  if (loading) {
    return (
      <div className="player-page-loading">
        <LoadingSpinner />
        <p>Loading player data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-page-error">
        <h2>Error Loading Player</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/stats')} className="back-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="player-page-error">
        <h2>Player Not Found</h2>
        <button onClick={() => navigate('/stats')} className="back-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="player-page">
      <div className="player-header">
        <button onClick={() => navigate('/stats')} className="back-button">
          ← Back to Dashboard
        </button>

        <div className="player-title-section">
          <h1>{player.name}</h1>
          <div className="player-meta">
            <span className={`position-badge ${player.position.toLowerCase()}`}>
              {player.position}
            </span>
            <span className="team-badge">{player.team}</span>
            {player.overallRank && (
              <span className="rank-badge">Overall: #{player.overallRank}</span>
            )}
            {player.positionRank && (
              <span className="pos-rank-badge">
                {player.position}: #{player.positionRank}
              </span>
            )}
          </div>
        </div>

        <div className="player-controls">
          <div className="view-mode-toggle">
            <button
              className={`mode-btn ${viewMode === 'raw' ? 'active' : ''}`}
              onClick={() => setViewMode('raw')}
            >
              Raw Stats
            </button>
            <button
              className={`mode-btn ${viewMode === 'fantasy' ? 'active' : ''}`}
              onClick={() => setViewMode('fantasy')}
            >
              Fantasy Points
            </button>
          </div>

          <div className="filter-controls">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="year-select"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>

            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="week-select"
            >
              <option value="ALL">All Weeks</option>
              <option value="total">Season Total</option>
              {Array.from({ length: 18 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Week {i + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="player-content">
        {/* Season Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-label">Total Points</div>
            <div className="card-value">
              {viewMode === 'fantasy' 
                ? formatStatValue(player.fantasyPoints || 0)
                : 'Raw Stats'
              }
            </div>
          </div>

          <div className="summary-card">
            <div className="card-label">Games Played</div>
            <div className="card-value">{player.gamesPlayed || 0}</div>
          </div>

          <div className="summary-card">
            <div className="card-label">Avg Per Game</div>
            <div className="card-value">
              {player.gamesPlayed ? 
                formatStatValue((player.fantasyPoints || 0) / player.gamesPlayed) :
                '0'
              }
            </div>
          </div>
        </div>

        {/* Detailed Stats Table */}
        <div className="stats-table-section">
          <h3>Detailed Statistics</h3>
          <div className="stats-table-container">
            <table className="player-stats-table">
              <thead>
                <tr>
                  <th>Statistic</th>
                  <th>Total</th>
                  <th>Average</th>
                  <th>Best Game</th>
                  <th>Worst Game</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((stat, index) => (
                  <tr key={index}>
                    <td className="stat-name">{stat.name}</td>
                    <td className="stat-total">
                      {formatStatValue(stat.total, stat.name)}
                    </td>
                    <td className="stat-average">
                      {formatStatValue(stat.average, stat.name)}
                    </td>
                    <td className="stat-best">
                      {formatStatValue(stat.best, stat.name)}
                    </td>
                    <td className="stat-worst">
                      {formatStatValue(stat.worst, stat.name)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Breakdown */}
        {selectedWeek === 'ALL' && (
          <div className="weekly-breakdown">
            <h3>Weekly Performance</h3>
            <div className="weeks-grid">
              {Array.from({ length: 18 }, (_, i) => {
                const week = i + 1;
                const weekData = player.weeklyStats?.find(w => w.week === week);
                return (
                  <div key={week} className="week-card">
                    <div className="week-number">Week {week}</div>
                    <div className="week-points">
                      {weekData ? 
                        formatStatValue(weekData.fantasyPoints || 0) : 
                        '0 pts'
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerPage;