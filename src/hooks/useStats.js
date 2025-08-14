import { useState, useEffect, useCallback } from 'react';
import { StatsAPI } from '../services/statsAPI.js';
import { LeagueService } from '../services/leagueService.js';
import { FantasyCalculator } from '../utils/fantasyCalculator.js';
import { FormatUtils } from '../utils/formatUtils.js';
import { DataUtils } from '../utils/dataUtils.js';
import { SortUtils } from '../utils/sortUtils.js';
import { DEFAULT_FILTERS } from '../config/statsConfig.js';

export const useStats = () => {
    const [currentFilters, setCurrentFilters] = useState(DEFAULT_FILTERS);
    const [apiState, setApiState] = useState({
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasMore: false
    });
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [currentView, setCurrentView] = useState('cards');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFantasyStats, setShowFantasyStats] = useState(false);
    const [currentScoringRules, setCurrentScoringRules] = useState({});
    const [userLeagues, setUserLeagues] = useState({});
    const [researchTableSort, setResearchTableSort] = useState({
        column: null,
        direction: 'desc'
    });
    const [statsAPI] = useState(() => new StatsAPI());

    // Initialize active league
    const activeLeagueId = currentFilters.league || DataUtils.initializeActiveLeague(userLeagues);

    // Calculate fantasy points functions
    const calculateFantasyPoints = useCallback((statName, rawStatValue) => {
        return FantasyCalculator.calculateFantasyPoints(statName, rawStatValue, currentScoringRules);
    }, [currentScoringRules]);

    const calculateTotalFantasyPoints = useCallback((player) => {
        return FantasyCalculator.calculateTotalFantasyPoints(player, currentScoringRules);
    }, [currentScoringRules]);

    const getStatValue = useCallback((player, statName) => {
        return FormatUtils.getStatValue(
            player, 
            statName, 
            showFantasyStats, 
            currentScoringRules, 
            calculateFantasyPoints
        );
    }, [showFantasyStats, currentScoringRules, calculateFantasyPoints]);

    // Load user leagues
    const loadUserLeagues = useCallback(async () => {
        try {
            const leagues = await LeagueService.loadUserLeagues(statsAPI);
            setUserLeagues(leagues);

            const defaultLeagueId = Object.keys(leagues)[0];
            if (defaultLeagueId && !currentFilters.league) {
                setCurrentFilters(prev => ({ ...prev, league: defaultLeagueId }));
                localStorage.setItem('activeLeagueId', defaultLeagueId);

                const rules = await LeagueService.loadScoringRulesForActiveLeague(defaultLeagueId, statsAPI);
                setCurrentScoringRules(rules);
            }

            return leagues;
        } catch (error) {
            console.warn('⚠️ Leagues failed to load, continuing with raw stats only');
            return {};
        }
    }, [statsAPI, currentFilters.league]);

    // Load scoring rules for active league
    const loadScoringRulesForActiveLeague = useCallback(async (leagueId) => {
        const rules = await LeagueService.loadScoringRulesForActiveLeague(leagueId, statsAPI);
        setCurrentScoringRules(rules);
        return rules;
    }, [statsAPI]);

    // Load stats
    const loadStats = useCallback(async (resetPage = true) => {
        if (apiState.loading) {
            return;
        }

        if (resetPage) {
            setApiState(prev => ({ ...prev, currentPage: 1 }));
            setCurrentPlayers([]);
        }

        setApiState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const playersToLoad = (resetPage ? 1 : apiState.currentPage) * 50;        
            const playersData = await statsAPI.getPlayersForDisplay(
                currentFilters.year,
                currentFilters.week,
                currentFilters.position,
                playersToLoad
            );

            if (!playersData.success || !playersData.data) {
                throw new Error('Failed to load players data');
            }

            let players = playersData.data;

            if (showFantasyStats && currentScoringRules && Object.keys(currentScoringRules).length > 0) {
                players = players.map(player => ({
                    ...player,
                    fantasyPoints: calculateTotalFantasyPoints(player)
                }));
            }

            setCurrentPlayers(players);
            setApiState(prev => ({
                ...prev,
                loading: false,
                totalRecords: Math.max(players.length, playersToLoad),
                hasMore: playersData.data.length >= playersToLoad,
                totalPages: Math.ceil(Math.max(players.length, playersToLoad) / 50)
            }));

        } catch (error) {
            console.error('Failed to load stats:', error);
            setApiState(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
            setCurrentPlayers([]);
        }
    }, [apiState.loading, apiState.currentPage, currentFilters, showFantasyStats, currentScoringRules, calculateTotalFantasyPoints, statsAPI]);

    // Filter handlers
    const handleFilterChange = useCallback(async (newFilters) => {
        // Handle year change - clear year data cache
        if (newFilters.year !== currentFilters.year) {
            statsAPI.yearDataLoaded.delete(newFilters.year);
        }

        setCurrentFilters(newFilters);

        // Handle league change
        if (newFilters.league !== currentFilters.league) {
            await loadScoringRulesForActiveLeague(newFilters.league);
        }

        await loadStats(true);
    }, [currentFilters, loadScoringRulesForActiveLeague, loadStats, statsAPI]);

    const handlePositionChange = useCallback(async (position) => {
        const newFilters = { ...currentFilters, position };
        setCurrentFilters(newFilters);
        await loadStats(true);
    }, [currentFilters, loadStats]);

    const handleToggleStats = useCallback(async (fantasyMode) => {
        setShowFantasyStats(fantasyMode);
        // Recalculate fantasy points if needed
        if (fantasyMode && currentScoringRules && Object.keys(currentScoringRules).length > 0) {
            const updatedPlayers = currentPlayers.map(player => ({
                ...player,
                fantasyPoints: calculateTotalFantasyPoints(player)
            }));
            setCurrentPlayers(updatedPlayers);
        }
    }, [currentPlayers, currentScoringRules, calculateTotalFantasyPoints]);

    const handleViewChange = useCallback((view) => {
        setCurrentView(view);
    }, []);

    const handleSearchChange = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleLoadMore = useCallback(async () => {
        if (apiState.hasMore && !apiState.loading) {
            setApiState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
            await loadStats(false);
        }
    }, [apiState.hasMore, apiState.loading, loadStats]);

    const handleSort = useCallback((column) => {
        const { sortedPlayers, newSort } = SortUtils.sortResearchTable(
            currentPlayers,
            column,
            researchTableSort,
            showFantasyStats,
            calculateTotalFantasyPoints
        );

        setCurrentPlayers(sortedPlayers);
        setResearchTableSort(newSort);
    }, [currentPlayers, researchTableSort, showFantasyStats, calculateTotalFantasyPoints]);

    const handlePlayerClick = useCallback((playerId) => {
        const url = `player.html?id=${encodeURIComponent(playerId)}`;
        window.location.href = url;
    }, []);

    // Get filtered players
    const getFilteredPlayers = useCallback(() => {
        return DataUtils.getFilteredPlayers(currentPlayers, searchQuery);
    }, [currentPlayers, searchQuery]);

    // Initialize on mount
    useEffect(() => {
        const initialize = async () => {
            console.log('🚀 Initializing Fantasy Football Stats with WORKING sort...');

            localStorage.removeItem('allScoringRules');

            try {
                await loadUserLeagues();
            } catch (error) {
                console.warn('⚠️ Leagues failed to load, continuing with raw stats only');
            }

            await loadStats(true);
            console.log('🎉 Stats initialization complete with WORKING SORT!');
        };

        initialize();
    }, [loadUserLeagues, loadStats]);

    return {
        // State
        currentFilters,
        apiState,
        currentPlayers,
        currentView,
        searchQuery,
        showFantasyStats,
        currentScoringRules,
        userLeagues,
        activeLeagueId,

        // Computed
        filteredPlayers: getFilteredPlayers(),

        // Handlers
        handleFilterChange,
        handlePositionChange,
        handleToggleStats,
        handleViewChange,
        handleSearchChange,
        handleLoadMore,
        handleSort,
        handlePlayerClick,

        // Utility functions
        calculateFantasyPoints,
        calculateTotalFantasyPoints,
        getStatValue,

        // API
        statsAPI
    };
};