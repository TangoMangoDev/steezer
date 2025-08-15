// src/services/fantasyAPI.ts - Fixed version
import { FantasyLeague } from '../types/fantasy';
import { RosterData } from '../types/roster';

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

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch leagues');
    }

    const leagues = data.data || [];

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

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch roster data');
    }

    const rosterData = data.data || { 
      Owned: {}, 
      NotOwned: {}, 
      week, 
      totalTeams: 0, 
      totalPlayers: 0 
    };

    const shortCacheKey = `roster-short-${leagueId}-${week}`;
    this.cache.set(shortCacheKey, rosterData);
    this.cacheExpiry.set(shortCacheKey, Date.now() + (5 * 60 * 1000)); // 5 minutes

    console.log(`✅ Fetched and cached roster data: ${rosterData.totalPlayers} players`);
    return rosterData;
  }

  async getAllRostersForLeague(leagueId: string): Promise<{ [week: number]: RosterData }> {
    console.log(`📋 Fetching all rosters for league ${leagueId}`);

    const allRosters: { [week: number]: RosterData } = {};

    for (let week = 1; week <= 18; week++) {
      try {
        const rosterData = await this.getRosterData(leagueId, week);
        if (rosterData.totalPlayers > 0) {
          allRosters[week] = rosterData;
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch roster data for week ${week}:`, error);
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

export const fantasyAPI = new FantasyAPIService();