import React from 'react';

export const FilterControls = ({ 
    currentFilters, 
    userLeagues, 
    showFantasyStats,
    onFilterChange,
    onToggleStats,
    activeLeagueId 
}) => {
    const handleYearChange = (e) => {
        const newYear = e.target.value;
        onFilterChange({
            ...currentFilters,
            year: newYear,
            week: 'total'
        });
    };

    const handleWeekChange = (e) => {
        onFilterChange({
            ...currentFilters,
            week: e.target.value
        });
    };

    const handleLeagueChange = (e) => {
        const newLeagueId = e.target.value;
        onFilterChange({
            ...currentFilters,
            league: newLeagueId
        });
        localStorage.setItem('activeLeagueId', newLeagueId);
    };

    const handleStatsToggle = (mode) => {
        onToggleStats(mode === 'fantasy');
    };

    return (
        <div className="filter-controls">
            <div className="filter-group">
                <label htmlFor="year-select">Year:</label>
                <select 
                    id="year-select" 
                    className="filter-dropdown"
                    value={currentFilters.year}
                    onChange={handleYearChange}
                >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="week-select">Week:</label>
                <select 
                    id="week-select" 
                    className="filter-dropdown"
                    value={currentFilters.week}
                    onChange={handleWeekChange}
                >
                    <option value="total">Season Total</option>
                    {Array.from({length: 18}, (_, i) => i + 1).map(week => (
                        <option key={week} value={week.toString()}>
                            Week {week}
                        </option>
                    ))}
                </select>
            </div>

            {Object.keys(userLeagues).length > 0 && (
                <div className="filter-group">
                    <label htmlFor="league-select">League:</label>
                    <select 
                        id="league-select" 
                        className="filter-dropdown"
                        value={activeLeagueId || ''}
                        onChange={handleLeagueChange}
                    >
                        {Object.entries(userLeagues).map(([leagueId, league]) => (
                            <option key={leagueId} value={leagueId}>
                                {league.leagueName || `League ${leagueId}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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
    );
};