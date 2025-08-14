export const DataUtils = {
    getFilteredPlayers(currentPlayers, searchQuery) {
        let filteredPlayers = [...currentPlayers];

        if (searchQuery) {
            filteredPlayers = filteredPlayers.filter(player => {
                return player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       player.team.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }

        return filteredPlayers;
    },

    getStatsForPosition(position) {
        const positionStats = {
            "QB": ["Pass Att", "Comp", "Inc", "Pass Yds", "Pass TD", "Int", "Sack", "Rush Att", "Rush Yds", "Rush TD", "Fum", "Fum Lost"],
            "RB": ["Rush Att", "Rush Yds", "Rush TD", "Rec", "Rec Yds", "Rec TD", "Fum", "Fum Lost"],
            "WR": ["Rec", "Rec Yds", "Rec TD", "Targets", "Rush Att", "Rush Yds", "Rush TD", "Fum", "Fum Lost"],
            "TE": ["Rec", "Rec Yds", "Rec TD", "Targets", "Rush Att", "Rush Yds", "Rush TD", "Fum", "Fum Lost"],
            "K": ["FG 0-19", "FG 20-29", "FG 30-39", "FG 40-49", "FG 50+", "PAT Made", "PAT Miss"],
            "DST": ["Pts Allow 0", "Pts Allow 1-6", "Pts Allow 7-13", "Pts Allow 14-20", "Pts Allow 21-27", "Pts Allow 28-34", "Pts Allow 35+", "Sack", "Int", "Fum Rec", "TD", "Safe", "Blk Kick"]
        };

        if (position === 'ALL') {
            const allStats = new Set();
            Object.values(positionStats).forEach(stats => {
                stats.forEach(stat => allStats.add(stat));
            });
            return Array.from(allStats);
        }
        return positionStats[position] || [];
    },

    getVisibleStats(players, allStats) {
        return allStats.filter(stat => !this.shouldHideColumn(players, stat));
    },

    shouldHideColumn(players, stat) {
        return players.every(player => {
            const value = player.stats[stat] || 0;
            return value === 0;
        });
    },

    initializeActiveLeague(userLeagues) {
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
};