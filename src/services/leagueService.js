
export const LeagueService = {
    async loadUserLeagues(statsAPI) {
        try {
            console.log('🔄 Loading user leagues...');

            const cached = localStorage.getItem('userLeagues');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < 3600000) {
                    console.log(`✅ Using cached leagues`);
                    return parsed.leagues;
                }
            }

            const response = await fetch('/data/stats/rules');

            if (!response.ok) {
                console.warn('⚠️ Failed to load leagues');
                return this.setEmptyDefaults();
            }

            const data = await response.json();

            if (data.needsImport) {
                return this.setEmptyDefaults();
            }

            if (data.leagues && data.scoringRules) {
                const userLeagues = data.leagues;

                Object.keys(userLeagues).forEach(leagueId => {
                    if (userLeagues[leagueId].teams) {
                        delete userLeagues[leagueId].teams;
                    }
                });

                for (const [leagueId, scoringRules] of Object.entries(data.scoringRules)) {
                    if (scoringRules && Object.keys(scoringRules).length > 0) {
                        await statsAPI.cache.setScoringRules(leagueId, scoringRules);
                    }
                }

                if (data.rosters) {
                    for (const [leagueId, leagueRosters] of Object.entries(data.rosters)) {
                        if (leagueRosters && typeof leagueRosters === 'object') {
                            for (const [week, rosterData] of Object.entries(leagueRosters)) {
                                if (rosterData && rosterData.rosters) {
                                    await statsAPI.cache.setRosters(leagueId, week, rosterData);
                                }
                            }
                        }
                    }
                }

                const defaultLeagueId = data.defaultLeagueId || Object.keys(userLeagues)[0];

                if (defaultLeagueId) {
                    localStorage.setItem('activeLeagueId', defaultLeagueId);
                }

                localStorage.setItem('userLeagues', JSON.stringify({
                    leagues: userLeagues,
                    timestamp: Date.now()
                }));

                return userLeagues;
            }

            return this.setEmptyDefaults();

        } catch (error) {
            console.error('❌ Error loading leagues:', error);
            return this.setEmptyDefaults();
        }
    },

    setEmptyDefaults() {
        return {};
    },

    async loadScoringRulesForActiveLeague(leagueId, statsAPI) {
        if (!leagueId) {
            return {};
        }

        try {
            const rulesData = await statsAPI.getScoringRules(leagueId);

            if (rulesData && rulesData[leagueId]) {
                return rulesData[leagueId];
            } else {
                return {};
            }

        } catch (error) {
            console.error(`❌ Error loading scoring rules:`, error);
            return {};
        }
    }
};
