// src/components/FantasyStatsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getMoonInfo } from '../utils/authUtils';
import StatsAPI from '../utils/statsAPI';
import AppHeader from './AppHeader';
import ViewControls from './ViewControls';
import CardsView from './CardsView';
import ResearchView from './ResearchView';
import StatsView from './StatsView';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './LoadingSpinner';
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

  // Filter handlers
  const handlePositionFilter = useCallback(async (position) => {
    setCurrentFilters(prev => ({ ...prev, position }));
    await loadFilteredData(position, currentFilters.search);
  }, [currentFilters.search, statsAPI]);

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
  }, [players, currentFilters.position, statsAPI]);

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

  // Load more players
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

  // View and stats handlers
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const toggleStatsMode = () => {
    setShowFantasyStats(prev => !prev);
  };

  // Sorting
  const handleSort = (column) => {
    const direction = sortConfig.column === column && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    setSortConfig({ column, direction });

    const sorted = [...players].sort((a, b) => {
      let aValue = a[column] || 0;
      let bValue = b[column] || 0;

      if (typeof aValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setPlayers(sorted);
  };

  if (loading && players.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={initializeApp} />;
  }

  return (
    <div className="fantasy-stats-app">
      <AppHeader 
        showFantasyStats={showFantasyStats}
        onToggleStatsMode={toggleStatsMode}
        currentFilters={currentFilters}
        onPositionFilter={handlePositionFilter}
        onSearchFilter={handleSearchFilter}
      />

      <ViewControls 
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <div className="container">
        {currentView === 'cards' && (
          <CardsView 
            players={players}
            showFantasyStats={showFantasyStats}
            scoringRules={scoringRules}
            statsAPI={statsAPI}
            onLoadMore={loadMorePlayers}
            hasMore={apiState.hasMore}
            loading={loading}
          />
        )}

        {currentView === 'research' && (
          <ResearchView 
            players={players}
                       showFantasyStats={showFantasyStats}
                       scoringRules={scoringRules}
                       statsAPI={statsAPI}
                       sortConfig={sortConfig}
                       onSort={handleSort}
                       onLoadMore={loadMorePlayers}
                       hasMore={apiState.hasMore}
                       loading={loading}
                     />
                   )}

                   {currentView === 'stats' && (
                     <StatsView 
                       players={players}
                       showFantasyStats={showFantasyStats}
                       scoringRules={scoringRules}
                       statsAPI={statsAPI}
                       currentPosition={currentFilters.position}
                     />
                   )}
                 </div>
               </div>
             );
            };

            export default FantasyStatsPage;