// src/pages/PlayerDetailPage.tsx - Fixed version
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useSortableTable } from '../hooks/useSortableTable';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import AnalyticsCards from '../components/player/AnalyticsCards';
import WeekSelector from '../components/common/WeekSelector';
import { STATS_CONFIG, NFL_WEEKS } from '../utils/constants';
import { formatStatValue, formatFantasyPoints } from '../utils/formatting';
import './PlayerDetailPage.css';

interface StatDisplay {
  statName: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
}

const PlayerDetailPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<string>('total');

  const { playerData, loading, error } = usePlayerStats(playerId!, selectedWeek);

  const currentYearData = playerData?.years?.['2024'];
  const previousYearData = playerData?.years?.['2023'];

  const weekData = useMemo(() => {
    if (!currentYearData) return null;

    if (selectedWeek === 'total') {
      return currentYearData.totals;
    }

    return currentYearData.weeks?.[selectedWeek]?.stats || null;
  }, [currentYearData, selectedWeek]);

  const statsForDisplay = useMemo(() => {
    if (!weekData || !playerData) return [];

    const position = playerData.position;
    const relevantStats = STATS_CONFIG.getStatsForPosition(position);

    const stats: StatDisplay[] = [];

    for (const statName of relevantStats) {
      const statId = Object.keys(STATS_CONFIG.STAT_ID_MAPPING).find(
        id => STATS_CONFIG.STAT_ID_MAPPING[id as keyof typeof STATS_CONFIG.STAT_ID_MAPPING].name === statName
      );

      if (!statId) continue;

      const currentValue = weekData[statId] || 0;
      const previousValue = previousYearData?.totals?.[statId] || 0;

      stats.push({
        statName,
        currentValue,
        previousValue,
        change: currentValue - previousValue,
        changePercent: previousValue > 0 ? ((currentValue - previousValue) / previousValue * 100) : 0
      });
    }

    return stats;
  }, [weekData, playerData, previousYearData]);

  const { sortedData, sortConfig, handleSort } = useSortableTable(statsForDisplay);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading player data..." />;
  }

  if (error || !playerData) {
    return (
      <ErrorMessage 
        message={error || 'Player not found'} 
        onRetry={() => navigate('/dashboard')} 
      />
    );
  }

  return (
    <div className="player-detail-page">
      <Header />

      <div className="player-detail-header">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back to Dashboard
        </button>

        <div className="player-title">
          <div>
            <h1>{playerData.playerName}</h1>
            <div className="player-meta">
              <span className="position-badge">{playerData.position}</span>
              <span className="team-badge">{playerData.team}</span>
              {playerData.rank && <span className="rank-badge">#{playerData.rank}</span>}
            </div>
          </div>

          <div className="player-controls">
            <WeekSelector
              value={selectedWeek}
              onChange={setSelectedWeek}
              weeks={['total', ...NFL_WEEKS]}
            />
          </div>
        </div>
      </div>

      <div className="player-detail-content">
        {currentYearData?.analytics && (
          <AnalyticsCards analytics={currentYearData.analytics} />
        )}

        <div className="stats-table-container">
          <h2>
            {selectedWeek === 'total' ? 'Season' : `Week ${selectedWeek}`} Statistics
          </h2>

          <table className="player-stats-table">
            <thead>
              <tr>
                <th 
                  className="sortable"
                  onClick={() => handleSort('statName')}
                >
                  Statistic
                  {sortConfig.column === 'statName' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('currentValue')}
                >
                  2024
                  {sortConfig.column === 'currentValue' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                {previousYearData && (
                  <>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('previousValue')}
                    >
                      2023
                      {sortConfig.column === 'previousValue' && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="sortable"
                      onClick={() => handleSort('change')}
                    >
                      Change
                      {sortConfig.column === 'change' && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((stat: StatDisplay) => (
                <tr key={stat.statName}>
                  <td className="stat-name">{stat.statName}</td>
                  <td className="stat-value">{formatStatValue(stat.currentValue)}</td>
                  {previousYearData && (
                    <>
                      <td className="stat-value">{formatStatValue(stat.previousValue)}</td>
                      <td className={`stat-change ${stat.change > 0 ? 'positive' : stat.change < 0 ? 'negative' : ''}`}>
                        {stat.change > 0 ? '+' : ''}{formatStatValue(stat.change)}
                        {stat.changePercent !== 0 && (
                          <span className="change-percent">
                            ({stat.changePercent > 0 ? '+' : ''}{stat.changePercent.toFixed(1)}%)
                          </span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedWeek !== 'total' && currentYearData?.weeks?.[selectedWeek] && (
          <div className="game-info">
            <h3>Game Information</h3>
            <div className="game-details">
              {currentYearData.weeks[selectedWeek].opponent && (
                <div className="detail-item">
                  <span className="detail-label">Opponent:</span>
                  <span className="detail-value">
                    {currentYearData.weeks[selectedWeek].opponent}
                  </span>
                </div>
              )}
              {currentYearData.weeks[selectedWeek].gameDate && (
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(currentYearData.weeks[selectedWeek].gameDate!).toLocaleDateString()}
                  </span>
                </div>
              )}
              {currentYearData.weeks[selectedWeek].fantasyPoints !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">Fantasy Points:</span>
                  <span className="detail-value fantasy-points">
                    {formatFantasyPoints(currentYearData.weeks[selectedWeek].fantasyPoints)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDetailPage;