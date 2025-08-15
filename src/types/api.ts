// src/types/api.ts - API RESPONSE TYPES
export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    count?: number;
    pagination?: PaginationInfo;
    requestId?: string;
    timestamp?: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasMore: boolean;
    limit: number;
    offset: number;
}

export interface PlayerAPIResponse extends APIResponse<Player[]> {
    year: string;
    week: string;
    position: string;
    filters?: PlayerFilters;
}

export interface RosterAPIResponse extends APIResponse<RosterData> {
    leagueId: string;
    week: number;
    cached?: boolean;
    cacheTimestamp?: string;
}

export interface LeaguesAPIResponse extends APIResponse<FantasyLeague[]> {
    userId: string;
    totalLeagues: number;
    activeLeagues: number;
}

export interface ScoringRulesAPIResponse extends APIResponse<ScoringRules> {
    leagueId: string;
    cached?: boolean;
    rulesCount: number;
}
