
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
        onFilterChange({
            ...currentFilters,
            league: e.target.value
        });
    };

    const handleStatsToggle = (mode) => {
        onToggleStats(mode === 'fantasy');
    };

    return (
        <>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    <label htmlFor="year-select" style={{ marginRight: '0.5rem' }}>Year:</label>
                    <select 
                        id="year-select" 
                        value={currentFilters.year} 
                        onChange={handleYearChange}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="week-select" style={{ marginRight: '0.5rem' }}>Week:</label>
                    <select 
                        id="week-select" 
                        value={currentFilters.week} 
                        onChange={handleWeekChange}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
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
                    <div>
                        <label htmlFor="league-select" style={{ marginRight: '0.5rem' }}>League:</label>
                        <select 
                            id="league-select" 
                            value={currentFilters.league || ''} 
                            onChange={handleLeagueChange}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            {Object.entries(userLeagues).map(([leagueId, league]) => (
                                <option key={leagueId} value={leagueId}>
                                    {league.leagueName || `League ${leagueId}`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                        onClick={() => handleStatsToggle('raw')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: !showFantasyStats ? '#007bff' : 'white',
                            color: !showFantasyStats ? 'white' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        Raw Stats
                    </button>
                    <button 
                        onClick={() => handleStatsToggle('fantasy')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: showFantasyStats ? '#007bff' : 'white',
                            color: showFantasyStats ? 'white' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        Fantasy Stats
                    </button>
                </div>
            </div>
        </>
    );
};
