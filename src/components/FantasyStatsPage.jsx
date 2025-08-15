// src/components/FantasyStatsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import './FantasyStatsPage.css';

// View Components
import CardsView from './CardsView';
import ResearchView from './ResearchView'; 
import StatsView from './StatsView';

const FantasyStatsPage = () => {
  // State Management
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFantasyStats, setShowFantasyStats] = useState(false);
  const [scoringRules, setScoringRules] = useState({});
  const [currentYear, setCurrentYear] = useState('2024');
  const [currentWeek, setCurrentWeek] = useState('total');

  // Filter & View State
  const [currentView, setCurrentView] = useState('cards');
  const [currentPosition, setCurrentPosition] = useState('ALL');

  // Pagination State
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  // Sort State
  const [sortConfig, setSortConfig] = useState({
    column: 'overallRank',
    direction: 'asc'
  });

  // API Base URL
  const API_BASE = '/data/stats';

  // Position Stats Configuration
  const POSITION_STATS = {
    'QB': ['Pass Att', 'Comp', 'Pass Yds', 'Pass TD', 'Int', 'Rush Att', 'Rush Yds', 'Rush TD', 'Fum'],
    'RB': ['Rush Att', 'Rush Yds', 'Rush TD', 'Rec', 'Rec Yds', 'Rec TD', 'Fum', 'Pass Att', 'Pass Yds', 'Pass TD'],
    'WR': ['Rec', 'Rec Yds', 'Rec TD', 'Rush Att', 'Rush Yds', 'Rush TD', 'Fum', 'Pass Att', 'Pass Yds', 'Pass TD'],
    'TE': ['Rec', 'Rec Yds', 'Rec TD', 'Rush Att', 'Rush Yds', 'Rush TD', 'Fum'],
    'K': ['FG', 'FGA', 'FG Pct', 'XP', 'XPA'],
    'DST': ['Sack', 'Int', 'Fum Rec', 'Fum Force', 'TD', 'Safe', 'Blk Kick', 'Pts Allow 0', 'Pts Allow 1-6', 'Pts Allow 7-13', 'Pts Allow 14-20', 'Pts Allow 21-27', 'Pts Allow 28-34', 'Pts Allow 35+']
  };

  // Load Players Data
  const loadPlayers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setPage(1);
      setPlayers([]);
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        year: currentYear,
        week: currentWeek,
        position: currentPosition,
        page: isRefresh ? 1 : page,
        limit: 50,
        search: searchQuery
      });

      const response = await fetch(`${API_BASE}/stats?${params}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to load players: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load players');
      }

      const newPlayers = data.data || [];

      if (isRefresh) {
        setPlayers(newPlayers);
      } else {
        setPlayers(prev => [...prev, ...newPlayers]);
      }

      setHasMore(data.pagination?.currentPage < data.pagination?.totalPages);

      if (!isRefresh) {
        setPage(prev => prev + 1);
      }

    } catch (err) {
      console.error('Error loading players:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentWeek, currentPosition, page, searchQuery]);

  // Load Scoring Rules
  const loadScoringRules = useCallback(async (leagueId = null) => {
    try {
      const params = leagueId ? `?leagueId=${leagueId}` : '';
      const response = await fetch(`${API_BASE}/rules${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.scoringRules) {
          setScoringRules(data.scoringRules);
        }
      }
    } catch (err) {
      console.warn('Could not load scoring rules:', err);
    }
  }, []);

  // Fantasy Points Calculation
  const calculateFantasyPoints = useCallback((statId, rawValue, scoringRule) => {
    if (!rawValue || rawValue === 0 || !scoringRule) return 0;

    let points = rawValue * parseFloat(scoringRule.points || 0);

    if (scoringRule.bonuses && Array.isArray(scoringRule.bonuses)) {
      scoringRule.bonuses.forEach(bonusRule => {
        const target = parseFloat(bonusRule.bonus.target || 0);
        const bonusPoints = parseFloat(bonusRule.bonus.points || 0);

        if (rawValue >= target && target > 0) {
          const bonusesEarned = Math.floor(rawValue / target);
          points += bonusesEarned * bonusPoints;
        }
      });
    }

    return Math.round(points * 100) / 100;
  }, []);

  // Get Stat Value (Raw or Fantasy)
  const getStatValue = useCallback((player, statName) => {
    const rawValue = player.stats?.[statName] || 0;

    if (!showFantasyStats) return rawValue;

    if (!scoringRules || Object.keys(scoringRules).length === 0) return rawValue;

    // Find matching scoring rule by stat name
    const ruleEntry = Object.entries(scoringRules).find(([_, rules]) => 
      Object.values(rules).some(rule => rule.name === statName)
    );

    if (!ruleEntry) return rawValue;

    const [leagueId, rules] = ruleEntry;
    const statRule = Object.values(rules).find(rule => rule.name === statName);

    if (!statRule) return rawValue;

    return calculateFantasyPoints(statRule.id, rawValue, statRule);
  }, [showFantasyStats, scoringRules, calculateFantasyPoints]);

  // Calculate Total Fantasy Points
  const calculateTotalFantasyPoints = useCallback((player) => {
    if (!showFantasyStats || !player.rawStats || !scoringRules) return 0;

    let totalPoints = 0;

    Object.entries(player.rawStats).forEach(([statId, statValue]) => {
      if (statValue && statValue !== 0) {
        Object.values(scoringRules).forEach(rules => {
          const rule = rules[statId];
          if (rule) {
            totalPoints += calculateFantasyPoints(statId, statValue, rule);
          }
        });
      }
    });

    return Math.round(totalPoints * 100) / 100;
  }, [showFantasyStats, scoringRules, calculateFantasyPoints]);

  // Filter Players
  const filteredPlayers = React.useMemo(() => {
    let filtered = [...players];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(player => 
        player.name?.toLowerCase().includes(query) ||
        player.team?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [players, searchQuery]);

  // Get Position Stats
  const getPositionStats = useCallback((position) => {
    if (position === 'ALL') {
      return [...new Set(Object.values(POSITION_STATS).flat())];
    }
    return POSITION_STATS[position] || [];
  }, []);

  // Debounced search
  const debouncedLoadPlayers = useCallback(
    debounce((isRefresh) => loadPlayers(isRefresh), 300),
    [loadPlayers]
  );

  // Effects
  useEffect(() => {
    loadPlayers(true);
    loadScoringRules();
  }, [currentYear, currentWeek, currentPosition]);

  useEffect(() => {
    if (searchQuery) {
      debouncedLoadPlayers(true);
    }
  }, [searchQuery, debouncedLoadPlayers]);

  // Event Handlers
  const handlePositionChange = (position) => {
    setCurrentPosition(position);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleLoadMore = () => {
    loadPlayers(false);
  };

  const handleSort = (column) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleStatsToggle = (mode) => {
    setShowFantasyStats(mode === 'fantasy');
  };

  // Component Props
  const viewProps = {
    players: filteredPlayers,
    showFantasyStats,
    scoringRules,
    getStatValue,
    calculateTotalFantasyPoints,
    getPositionStats,
    sortConfig,
    onSort: handleSort,
    onLoadMore: handleLoadMore,
    hasMore,
    loading
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => loadPlayers(true)} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="fantasy-stats-page">
      {/* Header */}
      <div className="header">
        <h1>Fantasy Football Dashboard</h1>

        {/* Position Filter */}
        <div className="position-filter">
          {['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'].map(position => (
            <button
              key={position}
              className={`position-btn ${currentPosition === position ? 'active' : ''}`}
              onClick={() => handlePositionChange(position)}
            >
              {position}
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <label>Year:</label>
            <select 
              value={currentYear} 
              onChange={(e) => setCurrentYear(e.target.value)}
              className="filter-dropdown"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Week:</label>
            <select 
              value={currentWeek} 
              onChange={(e) => setCurrentWeek(e.target.value)}
              className="filter-dropdown"
            >
              <option value="total">Season Total</option>
              {Array.from({length: 18}, (_, i) => (
                <option key={i+1} value={i+1}>Week {i+1}</option>
              ))}
            </select>
          </div>

          {/* Stats Toggle */}
          <div className="stats-toggle">
            <button
              className={`stats-toggle-btn ${!showFantasyStats ? 'active' : ''}`}
              onClick={() => handleStatsToggle('raw')}
            >
              Raw Stats
            </button>
            <button
              className={`stats-toggle-btn ${showFantasyStats ? 'active' : ''}`}
              onClick={() => handleStatsToggle('fantasy')}
            >
              Fantasy Stats
            </button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        {[
          { key: 'cards', label: 'Cards' },
          { key: 'research', label: 'Research' }, 
          { key: 'stats', label: 'Stats' }
        ].map(view => (
          <button
            key={view.key}
            className={`view-btn ${currentView === view.key ? 'active' : ''}`}
            onClick={() => handleViewChange(view.key)}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search players..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Content */}
        <div className="content">
          {loading && players.length === 0 ? (
            <div className="loading-spinner">Loading players...</div>
          ) : currentView === 'cards' ? (
            <CardsView {...viewProps} />
          ) : currentView === 'research' ? (
            <ResearchView {...viewProps} />
          ) : (
            <StatsView {...viewProps} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FantasyStatsPage;