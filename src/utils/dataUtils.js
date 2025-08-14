import { STATS_CONFIG, POSITION_CATEGORIES } from '../config/statsConfig.js';

export class DataUtils {
    static getFilteredPlayers(players, searchQuery) {
        let filteredPlayers = [...players];

        if (searchQuery) {
            filteredPlayers = filteredPlayers.filter(player => {
                return player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       player.team.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }

        return filteredPlayers;
    }

    static shouldHideColumn(players, stat) {
        return players.every(player => {
            const value = player.stats[stat] || 0;
            return value === 0;
        });
    }

    static getVisibleStats(players, allStats) {
        return allStats.filter(stat => !this.shouldHideColumn(players, stat));
    }

    static getStatsForPosition(position) {
        if (position === 'ALL') {
            const allStats = new Set();
            Object.values(STATS_CONFIG.POSITION_STATS).forEach(stats => {
                stats.forEach(stat => allStats.add(stat));
            });
            return Array.from(allStats);
        }
        return STATS_CONFIG.POSITION_STATS[position] || [];
    }

    static categorizeStats(stats) {
        const result = {};
        stats.forEach(stat => {
            for (const [category, categoryStats] of Object.entries(POSITION_CATEGORIES)) {
                if (categoryStats.includes(stat)) {
                    if (!result[category]) result[category] = [];
                    result[category].push(stat);
                    break;
                }
            }
        });
        return result;
    }

    static getStatLeaders(players, stat, limit = 3, showFantasyStats, getStatValue) {
        return players
            .filter(p => p.stats[stat] !== undefined && p.stats[stat] > 0)
            .map(p => ({ 
                name: p.name, 
                value: p.stats[stat] || 0,
                rawStats: p.rawStats
            }))
            .sort((a, b) => {
                const aValue = showFantasyStats ? getStatValue({stats: {[stat]: a.value}}, stat) : a.value;
                const bValue = showFantasyStats ? getStatValue({stats: {[stat]: b.value}}, stat) : b.value;

                if (stat.includes('Miss') || stat.includes('Allow') || stat === 'Int' || stat === 'Fum') {
                    return aValue - bValue;
                }
                return bValue - aValue;
            })
            .slice(0, limit);
    }

    static initializeActiveLeague(userLeagues) {
        let activeLeagueId = localStorage.getItem('activeLeagueId');

        if (!activeLeagueId || !userLeagues[activeLeagueId]) {
            const leagueIds = Object.keys(userLeagues);
            if (leagueIds.length > 0) {
                activeLeagueId = leagueIds[0];
                localStorage.setItem('activeLeagueId', activeLeagueId);
            }
        }

        return activeLeagueId;
    }
}