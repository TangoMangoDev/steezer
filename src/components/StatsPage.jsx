
import React from 'react';
import { useStats } from '../hooks/useStats.js';
import { FilterControls } from './FilterControls.jsx';
import { PositionFilter } from './PositionFilter.jsx';
import { ViewToggle } from './ViewToggle.jsx';
import { PlayerCard } from './PlayerCard.jsx';
// ResearchTable will be defined inline for now
import { StatsOverview } from './StatsOverview.jsx';
import {
    StatsPageContainer,
    Header,
    FilterControlsContainer,
    Container,
    SearchContainer,
    SearchInput,
    Content,
    LoadingState,
    ErrorState,
    EmptyState,
    PlayerGrid
} from './StatsPage.styled.js';

// ResearchTable Component
const ResearchTableComponent = () => {
    const allStats = ['Pass Yds', 'Pass TD', 'Rush Yds', 'Rush TD', 'Rec', 'Rec Yds', 'Rec TD'];
    const visibleStats = allStats; // Simplified for now

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '2rem',
            overflow: 'auto'
        }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'white', marginBottom: '1rem' }}>
                    Research Table - {showFantasyStats ? 'Fantasy Points' : 'Raw Stats'}
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Showing {filteredPlayers.length} players
                    </span>
                    {apiState.hasMore && (
                        <button 
                            onClick={handleLoadMore}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Load More Players
                        </button>
                    )}
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle} onClick={() => handleSort('overallRank')}>
                                Overall Rank
                            </th>
                            <th style={tableHeaderStyle} onClick={() => handleSort('positionRank')}>
                                Pos Rank
                            </th>
                            <th style={tableHeaderStyle} onClick={() => handleSort('name')}>
                                Player
                            </th>
                            {showFantasyStats && (
                                <th style={tableHeaderStyle} onClick={() => handleSort('fantasyPoints')}>
                                    Total Fantasy Pts
                                </th>
                            )}
                            {visibleStats.map(stat => (
                                <th key={stat} style={tableHeaderStyle} onClick={() => handleSort(stat)}>
                                    {stat}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlayers.map(player => (
                            <tr 
                                key={player.id}
                                onClick={() => handlePlayerClick(player.id)}
                                style={{
                                    cursor: 'pointer',
                                    ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                }}
                            >
                                <td style={tableCellStyle}>#{player.overallRank || '-'}</td>
                                <td style={tableCellStyle}>#{player.positionRank || '-'}</td>
                                <td style={tableCellStyle}>{player.name}</td>
                                {showFantasyStats && (
                                    <td style={tableCellStyle}>{calculateTotalFantasyPoints(player)} pts</td>
                                )}
                                {visibleStats.map(stat => {
                                    const value = showFantasyStats ? getStatValue(player, stat) : (player.stats[stat] || 0);
                                    return <td key={stat} style={tableCellStyle}>{value}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const tableHeaderStyle = {
    padding: '1rem 0.5rem',
    textAlign: 'left',
    borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
};

const tableCellStyle = {
    padding: '0.75rem 0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)'
};

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
                <LoadingState>
                    <div className="loading-spinner">Loading...</div>
                </LoadingState>
            );
        }

        if (apiState.error) {
            return (
                <ErrorState>
                    <div className="error-message">
                        <h3>Error loading data</h3>
                        <p>{apiState.error}</p>
                    </div>
                </ErrorState>
            );
        }

        if (filteredPlayers.length === 0) {
            return (
                <EmptyState>
                    <div className="empty-state-icon">🏈</div>
                    <h3>No players found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </EmptyState>
            );
        }

        switch (currentView) {
            case 'cards':
                return (
                    <PlayerGrid>
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
                    </PlayerGrid>
                );

            case 'research':
                return <ResearchTableComponent />;

            case 'stats':
                return (
                    <StatsOverview
                        players={filteredPlayers}
                        currentFilters={currentFilters}
                        showFantasyStats={showFantasyStats}
                        getStatValue={getStatValue}
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
        <StatsPageContainer>
            <Header>
                <h1>Fantasy Football Stats</h1>
                <FilterControlsContainer>
                    <PositionFilter 
                        currentPosition={currentFilters.position}
                        onPositionChange={handlePositionChange}
                    />
                    <FilterControls
                        currentFilters={currentFilters}
                        userLeagues={userLeagues}
                        showFantasyStats={showFantasyStats}
                        onFilterChange={handleFilterChange}
                        onToggleStats={handleToggleStats}
                        activeLeagueId={activeLeagueId}
                    />
                </FilterControlsContainer>
            </Header>

            <Container>
                <ViewToggle 
                    currentView={currentView}
                    onViewChange={handleViewChange}
                />

                <SearchContainer>
                    <SearchInput 
                        type="text" 
                        placeholder="Search players..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </SearchContainer>

                <Content>
                    {renderContent()}
                </Content>
            </Container>
        </StatsPageContainer>
    );
};
