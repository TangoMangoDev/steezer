// src/utils/statsAPI.js - FIXED to use existing method names
import { StatsCache } from './statsCache';
import { StatsConfig } from './statsConfig';
import { getMoonInfo } from './authUtils';

export class StatsAPI {
    constructor() {
        this.cache = new StatsCache();
        this.baseUrl = '/data/stats';
        this.currentYear = '2024';
        this.initialized = false;
        this.yearDataLoaded = new Set();
    }

    async init() {
        if (this.initialized) return;

        try {
            await this.cache.init();
            this.initialized = true;
            console.log('✅ StatsAPI initialized');
        } catch (error) {
            console.error('❌ Failed to initialize StatsAPI:', error);
            throw error;
        }
    }

    // Get authentication headers that your backend expects
    getAuthHeaders() {
        const moonInfo = getMoonInfo();
        if (!moonInfo || !moonInfo.user_status) {
            throw new Error('User not authenticated');
        }

        return {
            'Content-Type': 'application/json',
            'X-User-ID': moonInfo.user_status,
        };
    }

    // Load players data - using existing cache methods
    async loadPlayersData(options = {}) {
        await this.init();

        const {
            position = 'ALL',
            search = '',
            limit = 100,
            page = 1,
            year = this.currentYear,
            week = 'total'
        } = options;

        try {
            // Try to get from cache first for initial loads
            if (position === 'ALL' && week === 'total' && !search) {
                const cachedPlayers = await this.getPlayersFromCache(year, position);
                if (cachedPlayers.length > 0) {
                    console.log(`📦 Using cached data: ${cachedPlayers.length} players`);
                    return this.paginateResults(cachedPlayers, page, limit);
                }
            }

            // Fetch from API
            const params = new URLSearchParams({
                year,
                week,
                position: position !== 'ALL' ? position : 'ALL',
                page: page.toString(),
                limit: limit.toString()
            });

            const response = await fetch(`/data/stats/stats?${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.data) {
                // Process and cache the data
                const processedPlayers = await this.processPlayersData(data.data, year);

                // Cache the players using existing method
                await this.cachePlayersData(processedPlayers, year);

                // Apply search filter if needed
                let filteredPlayers = processedPlayers;
                if (search) {
                    filteredPlayers = this.filterPlayersBySearch(processedPlayers, search);
                }

                return {
                    players: filteredPlayers.slice((page - 1) * limit, page * limit),
                    totalCount: filteredPlayers.length,
                    hasMore: filteredPlayers.length > page * limit,
                    page: page,
                    totalPages: Math.ceil(filteredPlayers.length / limit)
                };
            }

            throw new Error('Invalid response format');

        } catch (error) {
            console.error('❌ Failed to load players data:', error);
            throw error;
        }
    }

    // Load scoring rules - using existing cache method names
    async loadScoringRules(leagueId = null) {
        try {
            await this.init();

            // Try cache first using existing method
            if (leagueId) {
                const cachedRules = await this.cache.getScoringRules(leagueId);
                if (cachedRules) {
                    console.log(`✅ Using cached scoring rules for ${leagueId}`);
                    return { [leagueId]: cachedRules };
                }
            }

            // Fetch from API
            const params = leagueId ? `?leagueId=${leagueId}` : '';
            const response = await fetch(`/data/stats/rules${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.scoringRules) {
                // Cache the rules using existing method name
                for (const [lId, rules] of Object.entries(data.scoringRules)) {
                    await this.cache.storeScoringRules(lId, rules); // FIXED: use existing method name
                }

                return data.scoringRules;
            }

            return {};

        } catch (error) {
            console.error('❌ Failed to load scoring rules:', error);
            return {};
        }
    }

    // Process players data to match your existing IndexedDB schema
    async processPlayersData(apiData, year) {
        const processedPlayers = [];

        for (const player of apiData) {
            try {
                const playerKey = `${year}.${player.playerId}.${player.position}.${player.rank || 999}`;

                // Parse weekly stats exactly like the static version
                let weeklyStats = {};
                if (player.weeklyStats) {
                    try {
                        weeklyStats = typeof player.weeklyStats === 'string' 
                            ? JSON.parse(player.weeklyStats) 
                            : player.weeklyStats;
                    } catch (parseError) {
                        console.error('Error parsing weekly stats:', parseError);
                        weeklyStats = {};
                    }
                }

                const processedPlayer = {
                    playerKey,
                    year: parseInt(year),
                    playerId: player.playerId,
                    name: player.playerName || player.name,
                    position: player.position,
                    team: player.team,
                    rank: player.rank || 999,
                    overallRank: player.overallRank || player.rank || 999,
                    positionRank: player.positionRank,
                    yearPosition: `${year}_${player.position}`,
                    yearRank: `${year}_${String(player.rank || 999).padStart(6, '0')}`,
                    weeklyStats,
                    stats: weeklyStats.total || {}, // Current stats for display
                    timestamp: new Date().toISOString()
                };

                processedPlayers.push(processedPlayer);
            } catch (error) {
                console.error('Error processing player:', player.playerName || player.playerId, error);
            }
        }

        return processedPlayers;
    }

    // Cache players data using existing methods
    async cachePlayersData(players, year) {
        try {
            const promises = players.map(player => this.cache.storePlayer(player));
            await Promise.all(promises);
            this.yearDataLoaded.add(year);
            console.log(`✅ Cached ${players.length} players for year ${year}`);
        } catch (error) {
            console.error('❌ Failed to cache players:', error);
        }
    }

    // Get players from cache using existing methods
    async getPlayersFromCache(year, position) {
        try {
            if (position === 'ALL') {
                return await this.cache.getPlayersByYear(year);
            } else {
                return await this.cache.getPlayersByYearPosition(year, position);
            }
        } catch (error) {
            console.error('❌ Cache retrieval error:', error);
            return [];
        }
    }

    // Get weekly stats for specific players
    async getWeeklyStats(playerIds, year = this.currentYear, week = '1') {
        try {
            const params = new URLSearchParams({
                year,
                week,
                playerIds: playerIds.join(',')
            });

            const response = await fetch(`/data/stats/weekly?${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            }

            throw new Error('Invalid response format');

        } catch (error) {
            console.error('❌ Failed to load weekly stats:', error);
            return [];
        }
    }

    // Get player missing weeks data
    async getPlayerMissingWeeks(playerId, year = this.currentYear, weeks = []) {
        try {
            const params = new URLSearchParams({
                playerId,
                year,
                weeks: weeks.join(',')
            });

            const response = await fetch(`/data/stats/player/missing-weeks?${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            }

            throw new Error('Invalid response format');

        } catch (error) {
            console.error('❌ Failed to load player missing weeks:', error);
            return null;
        }
    }

    // Utility methods exactly like the static version
    filterPlayersBySearch(players, search) {
        if (!search.trim()) return players;

        const searchTerm = search.toLowerCase();
        return players.filter(player => 
            player.name.toLowerCase().includes(searchTerm) ||
            player.team.toLowerCase().includes(searchTerm) ||
            player.position.toLowerCase().includes(searchTerm)
        );
    }

    paginateResults(players, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
            players: players.slice(startIndex, endIndex),
            totalCount: players.length,
            hasMore: endIndex < players.length,
            page: page,
            totalPages: Math.ceil(players.length / limit)
        };
    }

    // Fantasy stats calculation - exactly like static version
    getStatValue(player, stat, scoringRules = null) {
        return StatsConfig.getFantasyStatValue(player, stat, scoringRules);
    }

    getPositionStats(position) {
        return StatsConfig.getPositionStats(position);
    }

    categorizeStats(stats) {
        return StatsConfig.categorizeStats(stats);
    }

    // Clear all caches
    async clearCache() {
        await this.cache.clearAll();
        this.yearDataLoaded.clear();
        console.log('🗑️ Cleared all caches');
    }
}

export default StatsAPI;