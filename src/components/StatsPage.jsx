import React from 'react';
import { useStats } from '../hooks/useStats.js';
import { FilterControls } from './FilterControls.jsx';
import { PositionFilter } from './PositionFilter.jsx';
import { ViewToggle } from './ViewToggle.jsx';
import { PlayerCard } from './PlayerCard.jsx';
import { ResearchTable } from './ResearchTable.jsx';
import { StatsOverview } from './StatsOverview.jsx';

export const StatsPage = () => {
    const {
        currentFilters,
        apiState,
        currentView,
        searchQuery,
        showFantasyStats,
        userLeagues,
        activeLeagueId,
        filteredPlayers,
        handleFilterChange,
        handlePositionChange,
        handleToggleStats,
        handleViewChange,
        handleSearchChange,
        handleLoadMore,
        handleSort,
        handlePlayerClick,
        calculateTotalFantasyPoints,
        getStatValue
    } = useStats();

    const renderContent = () => {
        if (apiState.loading && filteredPlayers.length === 0) {
            return (
                <div className="loading-state">
                    <div className="loading-spinner">Loading...</div>
                </div>
            );
        }

        if (apiState.error) {
            return (
                <div className="error-state">
                    <div className="error-message">
                        <h3>Error loading data</h3>
                        <p>{apiState.error}</p>
                    </div>
                </div>
            );
        }

        if (filteredPlayers.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">🏈</div>
                    <h3>No players found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            );
        }

        switch (currentView) {
            case 'cards':
                return (
                    <div className="player-grid">
                        {filteredPlayers.map(player => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                showFantasyStats={showFantasyStats}
                                onPlayerClick={handlePlayerClick}
                                getStatValue={getStatValue}
                                calculateTotalFantasyPoints={calculateTotalFantasyPoints}
                            />
                        ))}
                    </div>
                );

            case 'research':
                return (
                    <ResearchTable
                        players={filteredPlayers}
                        currentFilters={currentFilters}
                        showFantasyStats={showFantasyStats}
                        onSort={handleSort}
                        onPlayerClick={handlePlayerClick}
                        onLoadMore={handleLoadMore}
                        hasMore={apiState.hasMore}
                        getStatValue={getStatValue}
                        calculateTotalFantasyPoints={calculateTotalFantasyPoints}
                    />
                );

            case 'stats':
                return (
                    <StatsOverview
                        players={filteredPlayers}
                        currentFilters={currentFilters}
                        showFantasyStats={showFantasyStats}
                        getStatValue={getStatValue}
                    />
                );

            default:
                return null;
        }
    };

    return (
      <div className="stats-page">
                 <div className="header">
                     <h1>Fantasy Football Stats</h1>
                     <PositionFilter 
                         currentPosition={currentFilters.position}
                         onPositionChange={handlePositionChange}
                     />
                     <div className="filter-controls-container">
                         <FilterControls
                             currentFilters={currentFilters}
                             userLeagues={userLeagues}
                             showFantasyStats={showFantasyStats}
                             onFilterChange={handleFilterChange}
                             onToggleStats={handleToggleStats}
                             activeLeagueId={activeLeagueId}
                         />
                     </div>
                 </div>

                 <ViewToggle 
                     currentView={currentView}
                     onViewChange={handleViewChange}
                 />

                 <div className="container">
                     <div className="search-container">
                         <input 
                             type="text" 
                             className="search-input" 
                             placeholder="Search players..."
                             value={searchQuery}
                             onChange={(e) => handleSearchChange(e.target.value)}
                         />
                     </div>

                     <div id="content">
                         {renderContent()}
                     </div>
                 </div>
             </div>
         );
      };