// src/pages/DashboardPage.tsx - Fixed version
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { usePlayersData } from '../hooks/usePlayersData';
import { useDebounce } from '../hooks/useDebounce';
import Header from '../components/layout/Header';
import PlayerCard from '../components/player/PlayerCard';
import SortableTable from '../components/table/SortableTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SearchInput from '../components/common/SearchInput';
import PositionFilter from '../components/common/PositionFilter';
import ViewToggle from '../components/common/ViewToggle';
import { Player, TableColumn } from '../types/player';
import { POSITIONS } from '../utils/constants';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    filters, 
    currentView, 
    searchQuery,
    setFilters,
    setCurrentView,
    setSearchQuery
  } = useAppStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  const { data: players, loading, error, hasMore, loadMore } = usePlayersData(filters);

  React.useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return players;

    const query = searchQuery.toLowerCase();
    return players.filter(player => 
      player.name.toLowerCase().includes(query) ||
      player.team.toLowerCase().includes(query) ||
      player.position.toLowerCase().includes(query)
    );
  }, [players, searchQuery]);

  const handlePlayerClick = useCallback((player: Player) => {
    navigate(`/player/${player.id}`);
  }, [navigate]);

  const handlePositionChange = useCallback((position: string) => {
    setFilters({ position });
  }, [setFilters]);

  const tableColumns: TableColumn<Player>[] = [
    {
      key: 'name',
      label: 'Player',
      render: (player: Player) => (
        <div className="player-cell">
          <img 
            src={player.photoUrl || '/default-player.jpg'} 
            alt={player.name}
            className="player-cell-photo"
          />
          <div>
            <div className="player-cell-name">{player.name}</div>
            <div className="player-cell-meta">
              {player.position} - {player.team}
            </div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'overallRank',
      label: 'Rank',
      render: (player: Player) => `#${player.overallRank}`,
      sortable: true
    },
    {
      key: 'positionRank',
      label: 'Pos Rank',
      render: (player: Player) => `#${player.positionRank}`,
      sortable: true
    },
    {
      key: 'fantasyPoints',
      label: 'Fantasy Pts',
      render: (player: Player) => player.fantasyPoints?.toFixed(1) || '0.0',
      sortable: true
    },
    {
      key: 'team',
      label: 'Team',
      sortable: true
    }
  ];

  if (loading && players.length === 0) {
    return <LoadingSpinner fullScreen message="Loading players..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-controls">
        <div className="controls-row">
          <PositionFilter
            positions={POSITIONS}
            activePosition={filters.position}
            onChange={handlePositionChange}
          />
        </div>

        <div className="controls-row">
          <ViewToggle
            views={['cards', 'research', 'stats']}
            activeView={currentView}
            onChange={setCurrentView}
          />

          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search players..."
          />
        </div>
      </div>

      <div className="dashboard-content">
        {currentView === 'cards' && (
          <div className="player-grid">
            {filteredPlayers.map(player => (
              <PlayerCard 
                key={player.id}
                player={player}
                onClick={handlePlayerClick}
              />
            ))}

            {hasMore && (
              <button 
                className="load-more-btn"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        )}

        {currentView === 'research' && (
          <SortableTable
            data={filteredPlayers}
            columns={tableColumns}
            onRowClick={handlePlayerClick}
            className="research-table"
          />
        )}

        {currentView === 'stats' && (
          <div className="stats-view">
            <StatsView players={filteredPlayers} />
          </div>
        )}
      </div>
    </div>
  );
};

// Stats View Component
const StatsView: React.FC<{ players: Player[] }> = ({ players }) => {
  const positionGroups = useMemo(() => {
    const groups: { [key: string]: Player[] } = {};

    players.forEach(player => {
      if (!groups[player.position]) {
        groups[player.position] = [];
      }
      groups[player.position].push(player);
    });

    return groups;
  }, [players]);

  return (
    <div className="stats-container">
      <h2>Statistical Analysis</h2>

      {Object.entries(positionGroups).map(([position, positionPlayers]) => (
        <div key={position} className="position-stats-section">
          <h3>{position} Statistics</h3>

          <div className="stats-summary">
            <div className="stat-card">
              <div className="stat-label">Total Players</div>
              <div className="stat-value">{positionPlayers.length}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Avg Fantasy Points</div>
              <div className="stat-value">
                {(
                  positionPlayers.reduce((sum, p) => sum + (p.fantasyPoints || 0), 0) / 
                  positionPlayers.length
                ).toFixed(1)}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Top Performer</div>
              <div className="stat-value">
                {positionPlayers[0]?.name || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;