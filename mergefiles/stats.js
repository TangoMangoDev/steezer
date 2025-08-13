// stats.js - FIXED WITH WORKING PLAYER.HTML APPROACH
let currentFilters = {
    league: null,
    team: 'ALL',
    week: 'total',
    position: 'ALL',
    year: '2024'
};

let apiState = {
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasMore: false
};

let currentPlayers = [];
let currentView = 'cards';
let searchQuery = '';
let showFantasyStats = false;
let currentScoringRules = {};
let userLeagues = {};
let eventListenersSetup = false;

// 🔥 WORKING SORT SYSTEM - COPIED FROM PLAYER.HTML 🔥
let researchTableSort = {
    column: null,
    direction: 'desc'
};

window.convertStatsForDisplay = function(rawStats) {
    if (!rawStats || typeof rawStats !== 'object') {
        return {};
    }

    const displayStats = {};

    for (const [statId, statValue] of Object.entries(rawStats)) {
        const statName = STAT_ID_MAPPING[statId];
        if (statName && statValue !== null && statValue !== undefined && statValue !== 0) {
            displayStats[statName] = statValue;
        }
    }

    return displayStats;
};

// Backend API functions (keep existing)
async function loadUserLeagues() {
    try {
        console.log('🔄 Loading user leagues...');

        const cached = localStorage.getItem('userLeagues');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < 3600000) {
                userLeagues = parsed.leagues;
                console.log(`✅ Using cached leagues`);

                const defaultLeagueId = Object.keys(userLeagues)[0];
                if (defaultLeagueId) {
                    currentFilters.league = defaultLeagueId;
                    localStorage.setItem('activeLeagueId', defaultLeagueId);

                    const rulesData = await window.statsAPI.getScoringRules(defaultLeagueId);
                    if (rulesData && rulesData[defaultLeagueId]) {
                        currentScoringRules = rulesData[defaultLeagueId];
                    }
                }

                return userLeagues;
            }
        }

        const response = await fetch('/data/stats/rules');

        if (!response.ok) {
            console.warn('⚠️ Failed to load leagues');
            return setEmptyDefaults();
        }

        const data = await response.json();

        if (data.needsImport) {
            return setEmptyDefaults();
        }

        if (data.leagues && data.scoringRules) {
            userLeagues = data.leagues;

            Object.keys(userLeagues).forEach(leagueId => {
                if (userLeagues[leagueId].teams) {
                    delete userLeagues[leagueId].teams;
                }
            });

            for (const [leagueId, scoringRules] of Object.entries(data.scoringRules)) {
                if (scoringRules && Object.keys(scoringRules).length > 0) {
                    await window.statsAPI.cache.setScoringRules(leagueId, scoringRules);
                }
            }

            if (data.rosters) {
                for (const [leagueId, leagueRosters] of Object.entries(data.rosters)) {
                    if (leagueRosters && typeof leagueRosters === 'object') {
                        for (const [week, rosterData] of Object.entries(leagueRosters)) {
                            if (rosterData && rosterData.rosters) {
                                await window.statsAPI.cache.setRosters(leagueId, week, rosterData);
                            }
                        }
                    }
                }
            }

            const defaultLeagueId = data.defaultLeagueId || Object.keys(userLeagues)[0];

            if (defaultLeagueId) {
                currentFilters.league = defaultLeagueId;
                localStorage.setItem('activeLeagueId', defaultLeagueId);

                if (data.scoringRules[defaultLeagueId]) {
                    currentScoringRules = data.scoringRules[defaultLeagueId];
                }
            }

            localStorage.setItem('userLeagues', JSON.stringify({
                leagues: userLeagues,
                timestamp: Date.now()
            }));

            return userLeagues;
        }

        return setEmptyDefaults();

    } catch (error) {
        console.error('❌ Error loading leagues:', error);
        return setEmptyDefaults();
    }
}

function setEmptyDefaults() {
    userLeagues = {};
    currentScoringRules = {};
    currentFilters.league = null;
    return {};
}

async function loadScoringRulesForActiveLeague(leagueId) {
    if (!leagueId) {
        currentScoringRules = {};
        return;
    }

    try {
        const rulesData = await window.statsAPI.getScoringRules(leagueId);

        if (rulesData && rulesData[leagueId]) {
            currentScoringRules = rulesData[leagueId];
            await loadStats(true);
        } else {
            currentScoringRules = {};
        }

    } catch (error) {
        console.error(`❌ Error loading scoring rules:`, error);
        currentScoringRules = {};
    }
}

function createFilterControls() {
    const activeLeagueId = currentFilters.league || initializeActiveLeague();

    return `
        <div class="filter-controls">
            <div class="filter-group">
                <label for="year-select">Year:</label>
                <select id="year-select" class="filter-dropdown">
                    <option value="2024" ${currentFilters.year === '2024' ? 'selected' : ''}>2024</option>
                    <option value="2023" ${currentFilters.year === '2023' ? 'selected' : ''}>2023</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="week-select">Week:</label>
                <select id="week-select" class="filter-dropdown">
                    <option value="total" ${currentFilters.week === 'total' ? 'selected' : ''}>Season Total</option>
                    ${Array.from({length: 18}, (_, i) => i + 1).map(week => `
                        <option value="${week}" ${currentFilters.week === week.toString() ? 'selected' : ''}>
                            Week ${week}
                        </option>
                    `).join('')}
                </select>
            </div>

            ${Object.keys(userLeagues).length > 0 ? `
                <div class="filter-group">
                    <label for="league-select">League:</label>
                    <select id="league-select" class="filter-dropdown">
                        ${Object.entries(userLeagues).map(([leagueId, league]) => `
                            <option value="${leagueId}" ${leagueId === activeLeagueId ? 'selected' : ''}>
                                ${league.leagueName || `League ${leagueId}`}
                            </option>
                        `).join('')}
                    </select>
                </div>
            ` : ''}

            <div class="stats-toggle">
                <button class="stats-toggle-btn ${!showFantasyStats ? 'active' : ''}" data-mode="raw">
                    Raw Stats
                </button>
                <button class="stats-toggle-btn ${showFantasyStats ? 'active' : ''}" data-mode="fantasy">
                    Fantasy Stats
                </button>
            </div>
        </div>
    `;
}

async function loadStats(resetPage = true) {
    if (apiState.loading) {
        return;
    }

    if (resetPage) {
        apiState.currentPage = 1;
        currentPlayers = [];
    }

    apiState.loading = true;
    apiState.error = null;

    updateFilterControlsUI();

    try {
        const playersToLoad = apiState.currentPage * 50;        
        const playersData = await window.statsAPI.getPlayersForDisplay(
            currentFilters.year,
            currentFilters.week,
            currentFilters.position,
            playersToLoad
        );

        if (!playersData.success || !playersData.data) {
            throw new Error('Failed to load players data');
        }

        currentPlayers = playersData.data;

        if (showFantasyStats && currentScoringRules && Object.keys(currentScoringRules).length > 0) {
            currentPlayers = currentPlayers.map(player => ({
                ...player,
                fantasyPoints: calculateTotalFantasyPoints(player)
            }));
        }

        apiState.totalRecords = Math.max(currentPlayers.length, playersToLoad);
        apiState.hasMore = playersData.data.length >= playersToLoad;
        apiState.totalPages = Math.ceil(apiState.totalRecords / 50);
        apiState.loading = false;

    } catch (error) {
        console.error('Failed to load stats:', error);
        apiState.error = error.message;
        apiState.loading = false;
        currentPlayers = [];
    }

    updateFilterControlsUI();
    await render();
}

function setupEventListeners() {
    if (eventListenersSetup) {
        return;
    }

    const yearSelect = document.getElementById('year-select');
    if (yearSelect) {
        yearSelect.addEventListener('change', async (e) => {
            const newYear = e.target.value;
            currentFilters.year = newYear;
            currentFilters.week = 'total';
            window.statsAPI.yearDataLoaded.delete(newYear);
            await loadStats(true);
        });
    }

    const weekSelect = document.getElementById('week-select');
    if (weekSelect) {
        weekSelect.addEventListener('change', async (e) => {
            currentFilters.week = e.target.value;
            await loadStats(true);
        });
    }

    const leagueSelect = document.getElementById('league-select');
    if (leagueSelect) {
        leagueSelect.addEventListener('change', async (e) => {
            const newLeagueId = e.target.value;
            currentFilters.league = newLeagueId;
            localStorage.setItem('activeLeagueId', newLeagueId);
            await loadScoringRulesForActiveLeague(newLeagueId);
            updateFilterControlsUI();
        });
    }

    document.querySelectorAll('.stats-toggle-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            document.querySelectorAll('.stats-toggle-btn').forEach(b => b.classList.remove('active'));
            const mode = e.target.dataset.mode;
            document.querySelectorAll(`[data-mode="${mode}"]`).forEach(b => b.classList.add('active'));
            showFantasyStats = mode === 'fantasy';
            await render();
        });
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentView = e.target.dataset.view;
            await render();
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            searchQuery = e.target.value.toLowerCase();
            await render();
        });
    }

    const positionFilter = document.getElementById('positionFilter');
    if (positionFilter) {
        positionFilter.addEventListener('click', async (e) => {
            if (e.target.classList.contains('position-btn')) {
                if (e.target.classList.contains('active')) {
                    return;
                }

                document.querySelectorAll('.position-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                currentFilters.position = e.target.dataset.position;
                await loadStats(true);
            }
        });
    }

    eventListenersSetup = true;
}

function updateFilterControlsUI() {
    const filterContainer = document.querySelector('.filter-controls-container');
    if (filterContainer) {
        filterContainer.innerHTML = createFilterControls();
        eventListenersSetup = false;
        setupEventListeners();
    }
}

function getFilteredPlayers() {
    let filteredPlayers = [...currentPlayers];

    if (searchQuery) {
        filteredPlayers = filteredPlayers.filter(player => {
            return player.name.toLowerCase().includes(searchQuery) ||
                   player.team.toLowerCase().includes(searchQuery);
        });
    }

    return filteredPlayers;
}

const positionStats = window.STATS_CONFIG.POSITION_STATS;
const keyStats = window.STATS_CONFIG.POSITION_KEY_STATS;

function calculateFantasyPoints(statName, rawStatValue) {
    if (!showFantasyStats || !rawStatValue || rawStatValue === 0) {
        return rawStatValue || 0;
    }

    if (!currentScoringRules || Object.keys(currentScoringRules).length === 0) {
        return rawStatValue || 0;
    }

    const statId = Object.keys(window.STATS_CONFIG.STAT_ID_MAPPING).find(id => 
        window.STATS_CONFIG.STAT_ID_MAPPING[id].name === statName
    );

    if (!statId || !currentScoringRules[statId]) {
        return rawStatValue || 0;
    }

    return window.STATS_CONFIG.calculateFantasyPoints(statId, rawStatValue, currentScoringRules[statId]);
}

function calculateTotalFantasyPoints(player) {
    if (!showFantasyStats || !player.rawStats) {
        return 0;
    }

    if (!currentScoringRules || Object.keys(currentScoringRules).length === 0) {
        return 0;
    }

    let totalPoints = 0;

    try {
        Object.entries(player.rawStats).forEach(([statId, statValue]) => {
            if (currentScoringRules[statId] && statValue !== 0) {
                const rule = currentScoringRules[statId];

                let points = statValue * parseFloat(rule.points || 0);

                if (rule.bonuses && Array.isArray(rule.bonuses)) {
                    rule.bonuses.forEach(bonusRule => {
                        const target = parseFloat(bonusRule.bonus.target || 0);
                        const bonusPoints = parseFloat(bonusRule.bonus.points || 0);

                        if (statValue >= target && target > 0) {
                            const bonusesEarned = Math.floor(statValue / target);
                            points += bonusesEarned * bonusPoints;
                        }
                    });
                }

                if (points !== 0) {
                    totalPoints += points;
                }
            }
        });

        return Math.round(totalPoints * 100) / 100;
    } catch (error) {
        console.error(`Error calculating total fantasy points:`, error);
        return 0;
    }
}

function getStatValue(player, statName) {
    const rawValue = player.stats[statName] || 0;

    if (!showFantasyStats) {
        return rawValue;
    }

    if (!currentScoringRules || Object.keys(currentScoringRules).length === 0) {
        return rawValue;
    }

    try {
        return calculateFantasyPoints(statName, rawValue);
    } catch (error) {
        console.error(`Error calculating fantasy points:`, error);
        return rawValue;
    }
}

function shouldHideColumn(players, stat) {
    return players.every(player => {
        const value = player.stats[stat] || 0;
        return value === 0;
    });
}

function getVisibleStats(players, allStats) {
    return allStats.filter(stat => !shouldHideColumn(players, stat));
}

async function render() {
    const content = document.getElementById('content');
    let filteredPlayers = getFilteredPlayers();

    if (!Array.isArray(filteredPlayers)) {
        filteredPlayers = [];
    }

    if (filteredPlayers.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏈</div>
                <h3>No players found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }

    if (showFantasyStats && currentScoringRules && Object.keys(currentScoringRules).length > 0) {
        filteredPlayers = filteredPlayers.map(player => {
            if (!player.fantasyPoints && player.rawStats) {
                player.fantasyPoints = calculateTotalFantasyPoints(player);
            }
            return player;
        });
    }

    switch (currentView) {
        case 'cards':
            renderCardsView(filteredPlayers);
            break;
        case 'research':
            renderResearchView(filteredPlayers);
            break;
        case 'stats':
            renderStatsView(filteredPlayers);
            break;
    }
}

function renderCardsView(players) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="player-grid">
            ${players.map(player => renderPlayerCard(player)).join('')}
        </div>
    `;
}

function renderPlayerCard(player) {
    const stats = keyStats[player.position] || [];
    const totalFantasyPoints = player.fantasyPoints || calculateTotalFantasyPoints(player);

    return `
        <div class="player-card fade-in" onclick="navigateToPlayer('${player.id}')">
            <div class="player-header">
                <div class="player-info">
                    <h3>${player.name}</h3>
                    <div class="player-meta">
                        <span class="position-badge">${player.position}</span>
                        <span>${player.team}</span>
                        ${showFantasyStats && totalFantasyPoints > 0 ? 
                            `<span class="fantasy-total">${totalFantasyPoints} pts</span>` : ''
                        }
                        ${showFantasyStats && player.overallRank ? 
                            `<span class="rank-badge">Overall: #${player.overallRank}</span>` : ''
                        }
                        ${showFantasyStats && player.positionRank ? 
                            `<span class="position-rank-badge">${player.position}: #${player.positionRank}</span>` : ''
                        }
                    </div>
                </div>
            </div>
            <div class="stat-grid">
                ${stats.map(stat => {
                    const rawValue = player.stats[stat] || 0;
                    const displayValue = getStatValue(player, stat);
                    const isFantasyMode = showFantasyStats && displayValue !== rawValue && displayValue > 0;

                    return `
                        <div class="stat-item">
                            <span class="stat-value ${isFantasyMode ? 'fantasy-points' : ''}">
                                ${formatStatValue(displayValue, stat, isFantasyMode)}
                            </span>
                            <span class="stat-label">${stat}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// 🔥 WORKING RESEARCH VIEW - COPIED FROM PLAYER.HTML APPROACH 🔥
function renderResearchView(players) {
    const content = document.getElementById('content');
    const allStats = getStatsForPosition(currentFilters.position);
    const visibleStats = getVisibleStats(players, allStats);

    content.innerHTML = `
        <div class="research-container fade-in">
            <div class="research-header">
                <h2>Research Table - ${showFantasyStats ? 'Fantasy Points' : 'Raw Stats'}</h2>
                <div class="research-controls">
                    <span class="player-count">Showing ${players.length} players</span>
                    ${apiState.hasMore ? '<button id="load-more-btn" class="clear-filters-btn">Load More Players</button>' : ''}
                </div>
            </div>
            <div class="research-table-wrapper">
                <table class="research-table">
                    <thead>
                        <tr>
                            <th onclick="sortResearchTable('overallRank')">Overall Rank</th>
                            <th onclick="sortResearchTable('positionRank')">Pos Rank</th>
                            <th onclick="sortResearchTable('name')">Player</th>
                            ${showFantasyStats ? '<th onclick="sortResearchTable(\'fantasyPoints\')">Total Fantasy Pts</th>' : ''}
                            ${visibleStats.map(stat => `<th onclick="sortResearchTable('${stat}')">${stat}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${players.map(player => `
                            <tr onclick="navigateToPlayer('${player.id}')">
                                <td>#${player.overallRank || '-'}</td>
                                <td>#${player.positionRank || '-'}</td>
                                <td>${player.name}</td>
                                ${showFantasyStats ? `<td>${calculateTotalFantasyPoints(player)} pts</td>` : ''}
                                ${visibleStats.map(stat => {
                                    const value = showFantasyStats ? getStatValue(player, stat) : (player.stats[stat] || 0);
                                    return `<td>${value}</td>`;
                                }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            if (apiState.hasMore && !apiState.loading) {
                apiState.currentPage++;
                await loadStats(false);
            }
        });
    }
}

// 🔥 WORKING SORT FUNCTION - EXACT COPY FROM PLAYER.HTML 🔥
function sortResearchTable(column) {
    console.log(`🔄 Sorting by: ${column}`);

    const table = document.querySelector('.research-table');
    if (!table) {
        console.error('❌ Research table not found');
        return;
    }

    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    let direction = 'desc';
    if (researchTableSort.column === column) {
        direction = researchTableSort.direction === 'desc' ? 'asc' : 'desc';
    }

    researchTableSort = { column, direction };

    const sortedRows = rows.sort((a, b) => {
        let aValue, bValue;

        switch(column) {
            case 'overallRank':
                aValue = parseInt(a.cells[0].textContent.replace('#', '')) || 999999;
                bValue = parseInt(b.cells[0].textContent.replace('#', '')) || 999999;
                break;
            case 'positionRank':
                aValue = parseInt(a.cells[1].textContent.replace('#', '')) || 999999;
                bValue = parseInt(b.cells[1].textContent.replace('#', '')) || 999999;
                break;
            case 'name':
                aValue = a.cells[2].textContent.trim();
                bValue = b.cells[2].textContent.trim();
                break;
            case 'fantasyPoints':
                const fpIndex = showFantasyStats ? 3 : -1;
                if (fpIndex > 0) {
                    aValue = parseFloat(a.cells[fpIndex].textContent.replace(/[^\d.-]/g, '')) || 0;
                    bValue = parseFloat(b.cells[fpIndex].textContent.replace(/[^\d.-]/g, '')) || 0;
                } else {
                    return 0;
                }
                break;
            default:
                const headers = Array.from(table.querySelectorAll('th'));
                const columnIndex = headers.findIndex(h => h.textContent.trim() === column);
                if (columnIndex >= 0 && a.cells[columnIndex] && b.cells[columnIndex]) {
                    aValue = parseFloat(a.cells[columnIndex].textContent.replace(/[^\d.-]/g, '')) || 0;
                    bValue = parseFloat(b.cells[columnIndex].textContent.replace(/[^\d.-]/g, '')) || 0;
                } else {
                    return 0;
                }
        }

        if (column === 'name') {
            return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
    });

    sortedRows.forEach(row => tbody.appendChild(row));
    console.log(`✅ Sorted by ${column} (${direction})`);
}

function renderStatsView(players) {
    const content = document.getElementById('content');
    const stats = getStatsForPosition(currentFilters.position);
    const statCategories = categorizeStats(stats);

    content.innerHTML = `
        <div class="stats-overview fade-in">
            <h2>Leaders ${showFantasyStats ? '(Fantasy Points)' : '(Raw Stats)'}</h2>
            ${Object.entries(statCategories).map(([category, categoryStats]) => `
                <div class="stat-category">
                    <div class="stat-category-title">${category}</div>
                    ${categoryStats.map(stat => {
                        const leaders = getStatLeaders(players, stat, 3);
                        return `
                            <div class="stat-row">
                                <span>${stat}</span>
                                <span>${leaders.map(l => {
                                    const displayValue = showFantasyStats ? 
                                        getStatValue({stats: {[stat]: l.value}}, stat) : l.value;
                                    const suffix = showFantasyStats && displayValue !== l.value && displayValue > 0 ? ' pts' : '';
                                    return `${l.name} (${formatStatValue(displayValue, stat, showFantasyStats && displayValue !== l.value)}${suffix})`;
                                }).join(', ')}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        </div>
    `;
}

// Helper functions
function getStatsForPosition(position) {
    if (position === 'ALL') {
        const allStats = new Set();
        Object.values(positionStats).forEach(stats => {
            stats.forEach(stat => allStats.add(stat));
        });
        return Array.from(allStats);
    }
    return positionStats[position] || [];
}

function initializeActiveLeague() {
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

function categorizeStats(stats) {
    const categories = {
        "Passing": ["Pass Att", "Comp", "Inc", "Pass Yds", "Pass TD", "Int", "Sack"],
        "Rushing": ["Rush Att", "Rush Yds", "Rush TD"],
        "Receiving": ["Rec", "Rec Yds", "Rec TD", "Targets"],
        "Kicking": ["FG 0-19", "FG 20-29", "FG 30-39", "FG 40-49", "FG 50+", "PAT Made", "PAT Miss"],
        "Defense": ["Tack Solo", "Tack Ast", "Pass Def", "Sack", "Int", "Fum Rec", "Fum Force", "TD", "Safe", "Blk Kick"],
        "Special Teams": ["Ret Yds", "Ret TD"],
        "Team Defense": ["Pts Allow 0", "Pts Allow 1-6", "Pts Allow 7-13", "Pts Allow 14-20", "Pts Allow 21-27", "Pts Allow 28-34", "Pts Allow 35+"],
        "Turnovers": ["Fum", "Fum Lost"]
    };

    const result = {};
    stats.forEach(stat => {
        for (const [category, categoryStats] of Object.entries(categories)) {
            if (categoryStats.includes(stat)) {
                if (!result[category]) result[category] = [];
                result[category].push(stat);
                break;
            }
        }
    });
    return result;
}

function getStatLeaders(players, stat, limit = 3) {
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

function formatStatValue(value, stat, isFantasyMode = false) {
    if (isFantasyMode && value > 0) {
return `${value} pts`;
   }

   if (typeof value === 'number') {
       if (value % 1 !== 0) {
           return value.toFixed(1);
       }
   }

   return value.toString();
}

function navigateToPlayer(playerId) {
   const url = `player.html?id=${encodeURIComponent(playerId)}`;
   window.location.href = url;
}

// Helper functions for bonus stats (keep existing functionality)
function getBonusTarget(statName) {
   if (!currentScoringRules) return '';

   const statId = Object.keys(STAT_ID_MAPPING).find(id => 
       STAT_ID_MAPPING[id] === statName
   );

   if (!statId || !currentScoringRules[statId]) return '';

   const rule = currentScoringRules[statId];
   if (!rule.bonuses || !Array.isArray(rule.bonuses) || rule.bonuses.length === 0) return '';

   return rule.bonuses[0].bonus.target || '';
}

function getBonusPoints(player, statName) {
   if (!showFantasyStats || !currentScoringRules || !player.rawStats) {
       return 0;
   }

   const statId = Object.keys(STAT_ID_MAPPING).find(id => 
       STAT_ID_MAPPING[id] === statName
   );

   if (!statId || !currentScoringRules[statId]) {
       return 0;
   }

   const rule = currentScoringRules[statId];
   const rawValue = player.rawStats[statId] || 0;

   if (!rule.bonuses || !Array.isArray(rule.bonuses) || rawValue === 0) {
       return 0;
   }

   let totalBonusPoints = 0;

   rule.bonuses.forEach((bonusRule) => {
       const target = parseFloat(bonusRule.bonus.target || 0);
       const bonusPoints = parseFloat(bonusRule.bonus.points || 0);

       if (target > 0 && rawValue >= target) {
           const bonusesEarned = Math.floor(rawValue / target);
           totalBonusPoints += bonusesEarned * bonusPoints;
       }
   });

   return Math.round(totalBonusPoints * 100) / 100;
}

function hasBonusRule(statName) {
   if (!currentScoringRules) return false;

   const statId = Object.keys(STAT_ID_MAPPING).find(id => 
       STAT_ID_MAPPING[id] === statName
   );

   if (!statId || !currentScoringRules[statId]) return false;

   const rule = currentScoringRules[statId];
   return rule.bonuses && Array.isArray(rule.bonuses) && rule.bonuses.length > 0;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
   console.log('🚀 Initializing Fantasy Football Dashboard with WORKING sort...');

   localStorage.removeItem('allScoringRules');

   const header = document.querySelector('.header');
   const filterControlsHtml = createFilterControls();
   if (filterControlsHtml && header) {
       const filterContainer = document.createElement('div');
       filterContainer.className = 'filter-controls-container';
       filterContainer.innerHTML = filterControlsHtml;
       header.appendChild(filterContainer);
   }

   setupEventListeners();

   try {
       await loadUserLeagues();
       updateFilterControlsUI();
   } catch (error) {
       console.warn('⚠️ Leagues failed to load, continuing with raw stats only');
   }

   await loadStats(true);
   console.log('🎉 Dashboard initialization complete with WORKING SORT!');
});