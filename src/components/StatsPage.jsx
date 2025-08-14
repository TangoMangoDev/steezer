
import React from 'react';
import { useStats } from '../hooks/useStats.js';
import { FilterControls } from './FilterControls.jsx';
import { PositionFilter } from './PositionFilter.jsx';
import { ViewToggle } from './ViewToggle.jsx';
import { PlayerCard } from './PlayerCard.jsx';
import { ResearchTable } from './ResearchTable.jsx';
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
