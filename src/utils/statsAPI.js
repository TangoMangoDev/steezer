// src/utils/statsAPI.js
import StatsCache from './statsCache';
import { StatsConfig } from './statsConfig';

export class StatsAPI {
    constructor() {
        this.cache = new StatsCache();
        this.baseUrl = 'https://fantasy-backend.stateezer.com/data/stats';
        this.baseMissingWeeksUrl = 'https://fantasy-backend.stateezer.com/data/stats/player/missing-weeks';
        this.scoringRulesUrl = 'https://fantasy-backend.stateezer.com/data/scoring-rules';
        this.currentYear = '2024';
        this.initialized = false;
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

    async loadPlayersData(options = {}) {
        await this.init();

        const {
            position = 'ALL',
            search = '',
            limit = 100,
            page = 1,
            year = this.currentYear
        } = options;

        try {
            // Try to get from cache first
            const cachedPlayers = await this.getPlayersFromCache(year, position);

            if (cachedPlayers.length > 0 && !search) {
                console.log(`📦 Using cached data: ${cachedPlayers.length} players`);
                return this.paginateResults(cachedPlayers, page, limit);
            }

            // Fetch from API
            const params = new URLSearchParams({
                year,
                position: position !== 'ALL' ? position : '',
                limit: limit.toString(),
                page: page.toString()
            });

            const response = await fetch(`${this.baseUrl}?${params}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.data) {
                // Process and cache the data
                const processedPlayers = await this.processPlayersData(data.data, year);

                // Cache the players
                await this.cachePlayersData(processedPlayers, year);

                return {
                    players: search ? this.filterPlayersBySearch(processedPlayers, search) : processedPlayers,
                    hasMore: data.pagination?.hasNext || false,
                    page: data.pagination?.page || page,
                    totalPages: data.pagination?.totalPages || 1,
                    totalRecords: data.pagination?.totalRecords || processedPlayers.length
                };
            }

            throw new Error('Invalid response format');

        } catch (error) {
            console.error('❌ Failed to load players data:', error);
            throw error;
        }
    }

    async processPlayersData(rawPlayers, year) {
        const playersWithFantasyPoints = rawPlayers.map(player => {
            let totalFantasyPoints = 0;

            // Calculate fantasy points if we have scoring rules
            if (player.stats) {
                Object.entries(player.stats).forEach(([statId, statValue]) => {
                    if (statValue && statValue > 0) {
                        // Use simplified scoring for now - can be enhanced with actual rules
                        switch(statId) {
                            case '4': totalFantasyPoints += statValue * 0.04; break; // Pass Yds
                            case '5': totalFantasyPoints += statValue * 4; break; // Pass TD
                            case '6': totalFantasyPoints += statValue * -2; break; // Pass Int
                            case '9': totalFantasyPoints += statValue * 0.1; break; // Rush Yds
                            case '10': totalFantasyPoints += statValue * 6; break; // Rush TD
                            case '12': totalFantasyPoints += statValue * 0.1; break; // Rec Yds
                            case '11': totalFantasyPoints += statValue * 1; break; // Rec
                            case '13': totalFantasyPoints += statValue * 6; break; // Rec TD
                            case '17': totalFantasyPoints += statValue * -2; break; // Fum
                            // Add more scoring rules as needed
                        }
                    }
                });
            }

            return {
                ...player,
                fantasyPoints: Math.round(totalFantasyPoints * 100) / 100
            };
        });

        // Rank players by fantasy points
        const rankedPlayers = playersWithFantasyPoints
            .sort((a, b) => b.fantasyPoints - a.fantasyPoints)
            .map((player, index) => ({
                ...player,
                rank: index + 1,           
                overallRank: index + 1
            }));

        // Add position ranks
        const positions = ['QB', 'RB', 'WR', 'TE', 'K', 'DST'];
        positions.forEach(position => {
            const positionPlayers = rankedPlayers
                .filter(player => player.position === position)
                .sort((a, b) => b.fantasyPoints - a.fantasyPoints);

            positionPlayers.forEach((player, index) => {
                player.positionRank = index + 1;
            });
        });

        return rankedPlayers;
    }

    async getPlayersFromCache(year, position) {
        try {
            const cachedPlayers = await this.cache.getPlayersByYear(year);

            if (position === 'ALL') {
                return cachedPlayers;
            }

            return cachedPlayers.filter(player => player.position === position);
        } catch (error) {
            console.warn('Failed to get players from cache:', error);
            return [];
        }
    }

    async cachePlayersData(players, year) {
        try {
            const cachePromises = players.map(player => {
                const playerKey = this.cache.generatePlayerKey(
                    year, 
                    player.playerId || player.id, 
                    player.position, 
                    player.rank
                );

                const playerData = {
                    ...player,
                    playerKey,
                    year: parseInt(year),
                    yearPosition: `${year}_${player.position}`,
                    yearRank: `${year}_${player.rank.toString().padStart(6, '0')}`,
                    timestamp: new Date().toISOString()
                };

                return this.cache.storePlayer(playerData);
            });

            await Promise.all(cachePromises);
            console.log(`✅ Cached ${players.length} players`);
        } catch (error) {
            console.warn('Failed to cache players data:', error);
        }
    }

    filterPlayersBySearch(players, searchQuery) {
        const query = searchQuery.toLowerCase();
        return players.filter(player => 
            player.name?.toLowerCase().includes(query) ||
            player.team?.toLowerCase().includes(query) ||
            player.position?.toLowerCase().includes(query)
        );
    }

    paginateResults(players, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPlayers = players.slice(startIndex, endIndex);

        return {
            players: paginatedPlayers,
            hasMore: endIndex < players.length,
            page,
            totalPages: Math.ceil(players.length / limit),
            totalRecords: players.length
        };
    }

    async loadScoringRules(leagueId = null) {
        await this.init();

        try {
            // Try cache first
            if (leagueId) {
                const cachedRules = await this.cache.getScoringRules(leagueId);
                if (cachedRules) {
                    console.log('📦 Using cached scoring rules');
                    return cachedRules;
                }
            }

            // Fetch from API
            const params = leagueId ? `?leagueId=${leagueId}` : '';
            const response = await fetch(`${this.scoringRulesUrl}${params}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.scoringRules) {
                // Cache the rules
                if (leagueId) {
                    await this.cache.storeScoringRules(leagueId, data.scoringRules);
                }

                return data.scoringRules;
            }

            return null;

        } catch (error) {
            console.error('❌ Failed to load scoring rules:', error);
            return null;
        }
    }

    getStatValue(player, stat, scoringRules = null) {
        return StatsConfig.getFantasyStatValue(player, stat, scoringRules);
    }

    getPositionStats(position) {
        return StatsConfig.getPositionStats(position);
    }

    categorizeStats(stats) {
        return StatsConfig.categorizeStats(stats);
    }
}

export default StatsAPI;