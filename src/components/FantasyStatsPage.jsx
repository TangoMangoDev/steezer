// src/components/FantasyStatsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getMoonInfo } from '../utils/authUtils';
import StatsAPI from '../utils/statsAPI';
import './FantasyStatsPage.css';

const FantasyStatsPage = () => {
  // State management
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('cards');
  const [currentFilters, setCurrentFilters] = useState({
    position: 'ALL',
    search: ''
  });
  const [showFantasyStats, setShowFantasyStats] = useState(false);
  const [scoringRules, setScoringRules] = useState(null);
  const [apiState, setApiState] = useState({
    hasMore: true,
    page: 1,
    totalPages: 1
  });
  const [sortConfig, setSortConfig] = useState({
    column: 'fantasyPoints',
    direction: 'desc'
  });
  const [statsAPI] = useState(() => new StatsAPI());

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      const moonInfo = getMoonInfo();
      if (!moonInfo) {
        window.location.href = '/signin';
        return;
      }

      // Initialize StatsAPI
      await statsAPI.init();

      // Load initial data
      await loadInitialData();

    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError('Failed to load fantasy data');
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      // Load player data
      const data = await statsAPI.loadPlayersData({
        position: 'ALL',
        limit: 100,
        page: 1
      });

      setPlayers(data.players || []);
      setApiState({
        hasMore: data.hasMore || false,
        page: data.page || 1,
        totalPages: data.totalPages || 1
      });

      // Load scoring rules
      const rules = await statsAPI.loadScoringRules();
      setScoringRules(rules);

    } catch (err) {
      console.error('Failed to load initial data:', err);
      throw err;
    }
  };

  const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'];

  // Filter handlers
  const handlePositionFilter = useCallback(async (position) => {
    setCurrentFilters(prev => ({ ...prev, position }));
    await loadFilteredData(position, currentFilters.search);
  }, [currentFilters.search]);

  const handleSearchFilter = useCallback((searchQuery) => {
    setCurrentFilters(prev => ({ ...prev, search: searchQuery }));

    if (searchQuery.trim()) {
      const filtered = players.filter(player => 
        player.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPlayers(filtered);
    } else {
      loadFilteredData(currentFilters.position, '');
    }
  }, [players, currentFilters.position]);

  const loadFilteredData = async (position, search) => {
    try {
      setLoading(true);

      const data = await statsAPI.loadPlayersData({
        position,
        search,
        limit: 100,
        page: 1
      });

      setPlayers(data.players || []);
      setApiState({
        hasMore: data.hasMore || false,
        page: data.page || 1,
        totalPages: data.totalPages || 1
      });
    } catch (err) {
      console.error('Failed to load filtered data:', err);
      setError('Failed to filter players');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePlayers = async () => {
    if (!apiState.hasMore || loading) return;

    try {
      setLoading(true);

      const data = await statsAPI.loadPlayersData({
        position: currentFilters.position,
        search: currentFilters.search,
        limit: 100,
        page: apiState.page + 1
      });

      setPlayers(prev => [...prev, ...(data.players || [])]);
      setApiState({
        hasMore: data.hasMore || false,
        page: data.page || apiState.page + 1,
        totalPages: data.totalPages || 1
      });
    } catch (err) {
      console.error('Failed to load more players:', err);
    } finally {
      setLoading(false);
    }
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

  if (loading && players.length === 0) {
    return (
      <div className="modern-loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <h3>Loading Fantasy Data</h3>
          <p>Fetching player stats and analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={initializeApp}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fantasy-dashboard">
      {/* Modern Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <span className="title-icon">🏈</span>
              Fantasy Analytics
            </h1>
            <p className="dashboard-subtitle">
              AI-powered insights for {players.length.toLocaleString()} players
            </p>
          </div>

          <div className="header-controls">
            <div className="stats-mode-toggle">
              <button 
                className={`toggle-btn ${!showFantasyStats ? 'active' : ''}`}
                onClick={() => setShowFantasyStats(false)}
              >
                <span className="toggle-icon">📊</span>
                Raw Stats
              </button>
              <button 
                className={`toggle-btn ${showFantasyStats ? 'active' : ''}`}
                onClick={() => setShowFantasyStats(true)}
              >
                <span className="toggle-icon">🎯</span>
                Fantasy Points
              </button>
            </div>

            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search players, teams..."
                value={currentFilters.search}
                onChange={(e) => handleSearchFilter(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Position Filter Pills */}
        <div className="position-filters">
          {positions.map(position => (
            <button
              key={position}
              className={`position-pill ${currentFilters.position === position ? 'active' : ''}`}
              onClick={() => handlePositionFilter(position)}
            >
              {position}
            </button>
          ))}
        </div>
      </header>

      {/* View Toggle */}
      <div className="view-selector">
        <div className="view-tabs">
          <button
            className={`view-tab ${currentView === 'cards' ? 'active' : ''}`}
            onClick={() => setCurrentView('cards')}
          >
            <span className="tab-icon">📱</span>
            Cards
          </button>
          <button
            className={`view-tab ${currentView === 'table' ? 'active' : ''}`}
            onClick={() => setCurrentView('table')}
          >
            <span className="tab-icon">📋</span>
            Table
          </button>
          <button
            className={`view-tab ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            <span className="tab-icon">📈</span>
            Analytics
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-content">
        {currentView === 'cards' && (
          <CardsView 
            players={players}
            showFantasyStats={showFantasyStats}
            getStatValue={getStatValue}
            formatStatValue={formatStatValue}
            getStatsForPosition={getStatsForPosition}
            navigateToPlayer={navigateToPlayer}
            onLoadMore={loadMorePlayers}
            hasMore={apiState.hasMore}
            loading={loading}
          />
        )}

        {currentView === 'table' && (
          <TableView 
            players={players}
            showFantasyStats={showFantasyStats}
            getStatValue={getStatValue}
            formatStatValue={formatStatValue}
            getStatsForPosition={getStatsForPosition}
            navigateToPlayer={navigateToPlayer}
            onLoadMore={loadMorePlayers}
            hasMore={apiState.hasMore}
            loading={loading}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView 
            players={players}
            showFantasyStats={showFantasyStats}
            getStatValue={getStatValue}
            formatStatValue={formatStatValue}
            getStatsForPosition={getStatsForPosition}
            currentPosition={currentFilters.position}
          />
        )}
      </main>
    </div>
  );
};

// Modern Cards View Component
const CardsView = ({ 
  players, 
  showFantasyStats, 
  getStatValue,
  formatStatValue,
  getStatsForPosition,
  navigateToPlayer,
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  return (
    <div className="cards-view">
      <div className="cards-grid">
        {players.map((player, index) => {
          const stats = getStatsForPosition(player.position);
          const totalFantasyPoints = showFantasyStats ? (player.fantasyPoints || 0) : 0;

          return (
            <div
              key={`${player.playerId}-${index}`}
              className="player-card"
              onClick={() => navigateToPlayer(player.playerId || player.id)}
            >
              <div className="card-header">
                <div className="player-avatar">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="player-info">
                  <h3 className="player-name">{player.name}</h3>
                  <div className="player-details">
                    <span className="position-badge">{player.position}</span>
                    <span className="team-name">{player.team}</span>
                  </div>
                </div>
                <div className="card-rank">
                  #{player.overallRank || player.rank || '—'}
                </div>
              </div>

              {showFantasyStats && totalFantasyPoints > 0 && (
                <div className="fantasy-score">
                  <span className="score-value">{totalFantasyPoints}</span>
                  <span className="score-label">Fantasy Points</span>
                </div>
              )}

              <div className="stats-grid">
                {stats.slice(0, 6).map(stat => {
                  const rawValue = player.stats?.[stat] || 0;
                  const displayValue = getStatValue(player, stat);

                  return (
                    <div key={stat} className="stat-cell">
                      <div className="stat-value">
                        {formatStatValue(displayValue, stat)}
                      </div>
                      <div className="stat-name">{stat}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="load-more-section">
          <button
            className="load-more-button"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-text">
                <span className="mini-spinner"></span>
                Loading more players...
              </span>
            ) : (
              <span>Load More Players</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// Modern Table View Component
const TableView = ({ 
  players, 
  showFantasyStats, 
  getStatValue,
  formatStatValue,
  getStatsForPosition,
  navigateToPlayer,
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  const allStats = getStatsForPosition('ALL');
  const visibleStats = allStats.filter(stat => 
    players.some(player => (player.stats?.[stat] || 0) > 0)
  ).slice(0, 8);

  return (
    <div className="table-view">
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th className="sticky-col">Rank</th>
              <th className="sticky-col">Player</th>
              {showFantasyStats && <th>Fantasy Pts</th>}
              {visibleStats.map(stat => (
                <th key={stat}>{stat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={`${player.playerId}-${index}`}
                className="table-row"
                onClick={() => navigateToPlayer(player.playerId || player.id)}
              >
                <td className="sticky-col rank-cell">
                  #{player.overallRank || player.rank || '—'}
                </td>
                <td className="sticky-col player-cell">
                  <div className="table-player-info">
                    <div className="table-avatar">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="table-player-name">{player.name}</div>
                      <div className="table-player-meta">
                        <span className="position-tag">{player.position}</span>
                        <span className="team-tag">{player.team}</span>
                      </div>
                    </div>
                  </div>
                </td>
                {showFantasyStats && (
                  <td className="fantasy-points-cell">
                    {player.fantasyPoints || 0}
                  </td>
                )}
                {visibleStats.map(stat => {
                  const value = getStatValue(player, stat);
                  return (
                    <td key={stat} className="stat-cell">
                      {formatStatValue(value, stat)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="load-more-section">
          <button
            className="load-more-button"
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

// Modern Analytics View Component
const AnalyticsView = ({ 
  players, 
  showFantasyStats, 
  getStatValue,
  formatStatValue,
  getStatsForPosition,
  currentPosition 
}) => {
  const stats = getStatsForPosition(currentPosition);

  const getTopPerformers = (stat, limit = 5) => {
    return players
      .map(player => ({
        ...player,
        value: getStatValue(player, stat)
      }))
      .filter(player => player.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  return (
    <div className="analytics-view">
      <div className="analytics-grid">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h3>{players.length.toLocaleString()}</h3>
              <p>Total Players</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">🏆</div>
            <div className="card-content">
              <h3>{currentPosition}</h3>
              <p>Position Filter</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>{showFantasyStats ? 'Fantasy' : 'Raw'}</h3>
              <p>Stats Mode</p>
            </div>
          </div>
        </div>

        <div className="leaders-section">
          {stats.slice(0, 4).map(stat => {
            const leaders = getTopPerformers(stat, 5);
            if (leaders.length === 0) return null;

            return (
              <div key={stat} className="leaders-card">
                <h4 className="leaders-title">{stat} Leaders</h4>
                <div className="leaders-list">
                  {leaders.map((leader, index) => (
                    <div key={leader.playerId} className="leader-item">
                      <div className="leader-rank">#{index + 1}</div>
                      <div className="leader-info">
                        <div className="leader-name">{leader.name}</div>
                        <div className="leader-team">{leader.position} • {leader.team}</div>
                      </div>
                      <div className="leader-value">
                        {formatStatValue(leader.value, stat)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FantasyStatsPage;