// src/types/player.ts - ALL TYPES USED IN APPLICATION
export interface PlayerAPIResponse {
  players: Player[];
  totalRecords: number;
  currentPage: number;
  hasMore: boolean;
}

export interface Player {
    id: string;
    name: string;
    position: string;
    team: string;
    overallRank: number;
    positionRank: number;
    fantasyPoints?: number;
    stats: PlayerStats;
    rawStats: RawStats;
    photoUrl?: string;
    status?: string;
    opponent?: string;
    gameTime?: string;
    isInjured?: boolean;
    depthChart?: string;
}

export interface PlayerStats {
    [statName: string]: number;
}

export interface RawStats {
    [statId: string]: number;
}

export interface PlayerAnalytics {
    consistency: number;
    volatility: number;
    boomRate: number;
    bustRate: number;
    tdDependency: number;
    averagePoints: number;
    medianPoints: number;
    standardDeviation: number;
    targetShare?: number;
    redZoneTargets?: number;
    snapPercentage?: number;
}

export interface PlayerCompleteData {
    playerId: string;
    playerName: string;
    position: string;
    team: string;
    rank?: number;
    years: {
        [year: string]: PlayerYearData;
    };
    lastUpdated: string;
}

export interface PlayerYearData {
    weeks: {
        [week: string]: {
            stats: RawStats;
            fantasyPoints: number;
            gameDate?: string;
            opponent?: string;
            gameResult?: string;
        };
    };
    totals: RawStats;
    analytics: PlayerAnalytics;
    playerName: string;
    position: string;
    team: string;
    hasBeenFetched: boolean;
}

export interface PlayerFilters {
    year: string;
    week: string;
    position: string;
    league?: string;
    team?: string;
    minSnaps?: number;
    maxRank?: number;
    isAvailable?: boolean;
}

export interface SortConfig {
    column: string | null;
    direction: 'asc' | 'desc';
}

export interface TableColumn<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
    className?: string;
}