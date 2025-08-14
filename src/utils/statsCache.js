// src/utils/statsCache.js
export class StatsCache {
    constructor() {
        this.dbName = 'nfl_stats_cache';
        this.version = 21;
        this.scoringRulesStore = 'scoring_rules';
        this.playersStore = 'players';
        this.rostersStore = 'rosters';
        this.db = null;
    }

    async init() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Clear all old stores
                const existingStores = Array.from(db.objectStoreNames);
                existingStores.forEach(storeName => {
                    db.deleteObjectStore(storeName);
                });

                // Scoring rules store
                const rulesStore = db.createObjectStore(this.scoringRulesStore, { keyPath: 'leagueId' });
                rulesStore.createIndex('timestamp', 'timestamp', { unique: false });

                // Players store with composite key
                const playersStore = db.createObjectStore(this.playersStore, { keyPath: 'playerKey' });
                playersStore.createIndex('year', 'year', { unique: false });
                playersStore.createIndex('position', 'position', { unique: false });
                playersStore.createIndex('rank', 'rank', { unique: false });
                playersStore.createIndex('yearPosition', 'yearPosition', { unique: false });
                playersStore.createIndex('yearRank', 'yearRank', { unique: false });
                playersStore.createIndex('timestamp', 'timestamp', { unique: false });

                // Rosters store
                const rostersStore = db.createObjectStore(this.rostersStore, { keyPath: 'rosterKey' });
                rostersStore.createIndex('leagueId', 'leagueId', { unique: false });
                rostersStore.createIndex('week', 'week', { unique: false });
                rostersStore.createIndex('leagueWeek', 'leagueWeek', { unique: false });
                rostersStore.createIndex('timestamp', 'timestamp', { unique: false });

                console.log('✅ IndexedDB stores created successfully');
            };
        });
    }

    generatePlayerKey(year, playerId, position, rank) {
        return `${year}.${playerId}.${position}.${rank}`;
    }

    async storePlayer(playerData) {
        await this.init();

        const transaction = this.db.transaction([this.playersStore], 'readwrite');
        const store = transaction.objectStore(this.playersStore);

        return new Promise((resolve, reject) => {
            const request = store.put(playerData);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getPlayer(playerKey) {
        await this.init();

        const transaction = this.db.transaction([this.playersStore], 'readonly');
        const store = transaction.objectStore(this.playersStore);

        return new Promise((resolve, reject) => {
            const request = store.get(playerKey);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getPlayersByYear(year) {
        await this.init();

        const transaction = this.db.transaction([this.playersStore], 'readonly');
        const store = transaction.objectStore(this.playersStore);
        const index = store.index('year');

        return new Promise((resolve, reject) => {
            const request = index.getAll(parseInt(year));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async storeScoringRules(leagueId, rules) {
        await this.init();

        const transaction = this.db.transaction([this.scoringRulesStore], 'readwrite');
        const store = transaction.objectStore(this.scoringRulesStore);

        const data = {
            leagueId,
            rules,
            timestamp: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getScoringRules(leagueId) {
        await this.init();

        const transaction = this.db.transaction([this.scoringRulesStore], 'readonly');
        const store = transaction.objectStore(this.scoringRulesStore);

        return new Promise((resolve, reject) => {
            const request = store.get(leagueId);
            request.onsuccess = () => resolve(request.result?.rules);
            request.onerror = () => reject(request.error);
        });
    }
}

export default StatsCache;