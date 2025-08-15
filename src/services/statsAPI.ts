// src/services/statsAPI.ts - COMPLETE API SERVICE
import { 
    Player, 
    PlayerAPIResponse, 
    PlayerCompleteData 
} from '../types/player';
import { 
    FantasyLeague, 
    ScoringRules 
} from '../types/fantasy';
import { RosterData } from '../types/roster';

interface LeaguesAPIResponse {
    success: boolean;
    data: FantasyLeague[];
    error?: string;
}

interface RosterAPIResponse {
    success: boolean;
    data: RosterData;
    error?: string;
}

interface ScoringRulesAPIResponse {
    success: boolean;
    data: ScoringRules;
    error?: string;
}

class StatsAPIService {
    private baseUrl = '/data/stats';
    private cache = new Map<string, any>();
    private cacheExpiry = new Map<string, number>();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    private isExpired(key: string): boolean {
        const expiry = this.cacheExpiry.get(key);
        return !expiry || Date.now() > expiry;
    }

    private setCache(key: string, data: any): void {
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
    }

    private getCache(key: string): any | null {
        if (this.isExpired(key)) {
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            return null;
        }
        return this.cache.get(key) || null;
    }

    async getPlayersForDisplay(
        year: string,
        week: string,
        position: string,
        limit: number = 50,
        page: number = 1
    ): Promise<PlayerAPIResponse> {
        const cacheKey = `players-${year}-${week}-${position}-${limit}-${page}`;
        const cached = this.getCache(cacheKey);

        if (cached) {
            console.log(`✅ Returning cached players data for ${cacheKey}`);
            return cached;
        }

        const params = new URLSearchParams({
            year,
            week,
            position,
            limit: limit.toString(),
            page: page.toString()
        });

        console.log(`🌐 Fetching players from API: ${this.baseUrl}?${params}`);

        const response = await fetch(`${this.baseUrl}?${params}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': this.getUserId()
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data: PlayerAPIResponse = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'API request failed');
        }

        // Cache successful responses
        this.setCache(cacheKey, data);
        console.log(`✅ Fetched and cached ${data.data?.length || 0} players`);

        return data;
    }

    async getPlayerStats(playerId: string, year: string = '2024'): Promise<PlayerCompleteData> {
        const cacheKey = `player-${playerId}-${year}`;
        const cached = this.getCache(cacheKey);

        if (cached) {
            console.log(`✅ Returning cached player data for ${playerId}`);
            return cached;
        }

        console.log(`🌐 Fetching player stats for ${playerId} year ${year}`);

        const response = await fetch(`${this.baseUrl}/player/${playerId}?year=${year}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': this.getUserId()
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch player stats: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch player stats');
        }

        // Cache for shorter duration for individual player data
        const shortCacheKey = `player-short-${playerId}-${year}`;
        this.cache.set(shortCacheKey, data.data);
        this.cacheExpiry.set(shortCacheKey, Date.now() + (2 * 60 * 1000)); // 2 minutes

        console.log(`✅ Fetched and cached player data for ${playerId}`);
        return data.data;
    }

    async getWeeklyStats(
        year: string,
        week: string,
        playerIds: string[]
    ): Promise<{ data: Player[]; success: boolean }> {
        if (playerIds.length === 0) {
            return { data: [], success: true };
        }

        if (playerIds.length > 100) {
            throw new Error('Maximum 100 player IDs per request');
        }

        const playerIdsString = playerIds.join(',');
        const cacheKey = `weekly-${year}-${week}-${playerIdsString.slice(0, 50)}`;
        const cached = this.getCache(cacheKey);

        if (cached) {
            console.log(`✅ Returning cached weekly data for week ${week}`);
            return cached;
        }

        const params = new URLSearchParams({
            year,
            week,
            playerIds: playerIdsString
        });

        console.log(`🌐 Fetching weekly stats: ${year} week ${week} for ${playerIds.length} players`);

const response = await fetch(`${this.baseUrl}/weekly?${params}`, {
           credentials: 'include',
           headers: {
               'Content-Type': 'application/json',
               'X-User-ID': this.getUserId()
           }
       });

       if (!response.ok) {
           throw new Error(`Failed to fetch weekly stats: ${response.status} ${response.statusText}`);
       }

       const data = await response.json();

       if (!data.success) {
           throw new Error(data.error || 'Failed to fetch weekly stats');
       }

       // Cache weekly data
       this.setCache(cacheKey, data);
       console.log(`✅ Fetched and cached weekly stats for ${playerIds.length} players`);

       return data;
   }

   async getScoringRules(leagueId: string): Promise<ScoringRules> {
       const cacheKey = `scoring-rules-${leagueId}`;
       const cached = this.getCache(cacheKey);

       if (cached) {
           console.log(`✅ Returning cached scoring rules for ${leagueId}`);
           return cached;
       }

       console.log(`🌐 Fetching scoring rules for league ${leagueId}`);

       const response = await fetch(`${this.baseUrl}/rules?leagueId=${leagueId}`, {
           credentials: 'include',
           headers: {
               'Content-Type': 'application/json',
               'X-User-ID': this.getUserId()
           }
       });

       if (!response.ok) {
           throw new Error(`Failed to fetch scoring rules: ${response.status} ${response.statusText}`);
       }

       const data: ScoringRulesAPIResponse = await response.json();

       if (!data.success) {
           throw new Error(data.error || 'Failed to fetch scoring rules');
       }

       const rules = data.data || {};

       // Cache scoring rules for longer (they rarely change)
       const longCacheKey = `scoring-rules-long-${leagueId}`;
       this.cache.set(longCacheKey, rules);
       this.cacheExpiry.set(longCacheKey, Date.now() + (24 * 60 * 60 * 1000)); // 24 hours

       console.log(`✅ Fetched and cached scoring rules for ${leagueId}`);
       return rules;
   }

   async getPlayerMissingWeeks(playerId: string, year: string = '2024'): Promise<any> {
       const response = await fetch(`${this.baseUrl}/player/missing-weeks?playerId=${playerId}&year=${year}`, {
           credentials: 'include',
           headers: {
               'Content-Type': 'application/json',
               'X-User-ID': this.getUserId()
           }
       });

       if (!response.ok) {
           throw new Error(`Failed to fetch missing weeks: ${response.status} ${response.statusText}`);
       }

       const data = await response.json();

       if (!data.success) {
           throw new Error(data.error || 'Failed to fetch missing weeks');
       }

       return data;
   }

   private getUserId(): string {
       return localStorage.getItem('userId') || '';
   }

   clearCache(): void {
       this.cache.clear();
       this.cacheExpiry.clear();
       console.log('🗑️ Cleared stats API cache');
   }
}

// src/services/fantasyAPI.ts - COMPLETE FANTASY API SERVICE
class FantasyAPIService {
   private baseUrl = '/data/fantasy';
   private cache = new Map<string, any>();
   private cacheExpiry = new Map<string, number>();
   private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

   private isExpired(key: string): boolean {
       const expiry = this.cacheExpiry.get(key);
       return !expiry || Date.now() > expiry;
   }

   private setCache(key: string, data: any): void {
       this.cache.set(key, data);
       this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
   }

   private getCache(key: string): any | null {
       if (this.isExpired(key)) {
           this.cache.delete(key);
           this.cacheExpiry.delete(key);
           return null;
       }
       return this.cache.get(key) || null;
   }

   async getLeagues(): Promise<FantasyLeague[]> {
       const cacheKey = 'user-leagues';
       const cached = this.getCache(cacheKey);

       if (cached) {
           console.log('✅ Returning cached leagues');
           return cached;
       }

       console.log('🌐 Fetching user leagues from API');

       const response = await fetch(`${this.baseUrl}/leagues`, {
           credentials: 'include',
           headers: {
               'Content-Type': 'application/json',
               'X-User-ID': this.getUserId()
           }
       });

       if (!response.ok) {
           throw new Error(`Failed to fetch leagues: ${response.status} ${response.statusText}`);
       }

       const data: LeaguesAPIResponse = await response.json();

       if (!data.success) {
           throw new Error(data.error || 'Failed to fetch leagues');
       }

       const leagues = data.data || [];

       // Cache leagues for longer duration
       this.setCache(cacheKey, leagues);
       console.log(`✅ Fetched and cached ${leagues.length} leagues`);

       return leagues;
   }

   async importLeagues(leagueIds: string[]): Promise<any> {
       console.log(`🔄 Importing ${leagueIds.length} leagues`);

       const response = await fetch(`${this.baseUrl}/teams`, {
           method: 'POST',
           credentials: 'include',
           headers: {
               'Content-Type': 'application/json',
               'X-User-ID': this.getUserId()
           },
           body: JSON.stringify({ leagueIds })
       });

       if (!response.ok) {
           throw new Error(`Failed to import leagues: ${response.status} ${response.statusText}`);
       }

       const data = await response.json();

       if (!data.success) {
           throw new Error(data.error || 'Failed to import leagues');
       }

       // Clear cache after import
       this.clearCache();

       console.log(`✅ Successfully imported ${data.importedCount} leagues`);
       return data;
   }

   async getRosterData(leagueId: string, week: number): Promise<RosterData> {
       const cacheKey = `roster-${leagueId}-${week}`;
       const cached = this.getCache(cacheKey);

       if (cached) {
           console.log(`✅ Returning cached roster data for ${leagueId} week ${week}`);
           return cached;
       }

       console.log(`🌐 Fetching roster data for league ${leagueId} week ${week}`);

       const response = await fetch(
           `${this.baseUrl}/rosters?leagueId=${leagueId}&week=${week}`,
           {
               credentials: 'include',
               headers: {
                   'Content-Type': 'application/json',
                   'X-User-ID': this.getUserId()
               }
           }
       );

       if (!response.ok) {
           throw new Error(`Failed to fetch roster data: ${response.status} ${response.statusText}`);
       }

       const data: RosterAPIResponse = await response.json();

       if (!data.success) {
           throw new Error(data.error || 'Failed to fetch roster data');
       }

       const rosterData = data.data || { Owned: {}, NotOwned: {}, week, totalTeams: 0, totalPlayers: 0 };

       // Cache roster data for shorter duration (rosters change frequently)
       const shortCacheKey = `roster-short-${leagueId}-${week}`;
       this.cache.set(shortCacheKey, rosterData);
       this.cacheExpiry.set(shortCacheKey, Date.now() + (5 * 60 * 1000)); // 5 minutes

       console.log(`✅ Fetched and cached roster data: ${rosterData.totalPlayers} players`);
       return rosterData;
   }

   async getAllRostersForLeague(leagueId: string): Promise<{ [week: number]: RosterData }> {
       console.log(`📋 Fetching all rosters for league ${leagueId}`);

       const allRosters: { [week: number]: RosterData } = {};

       // Fetch rosters for weeks 1-18
       for (let week = 1; week <= 18; week++) {
           try {
               const rosterData = await this.getRosterData(leagueId, week);
               if (rosterData.totalPlayers > 0) {
                   allRosters[week] = rosterData;
               }
           } catch (error) {
               console.warn(`⚠️ Failed to fetch roster data for week ${week}:`, error);
               // Continue with other weeks
           }
       }

       console.log(`✅ Fetched rosters for ${Object.keys(allRosters).length} weeks`);
       return allRosters;
   }

   private getUserId(): string {
       return localStorage.getItem('userId') || '';
   }

   clearCache(): void {
       this.cache.clear();
       this.cacheExpiry.clear();
       console.log('🗑️ Cleared fantasy API cache');
   }
}

export const statsAPI = new StatsAPIService();
export const fantasyAPI = new FantasyAPIService();