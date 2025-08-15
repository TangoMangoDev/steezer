// src/types/fantasy.ts - FANTASY TYPES
export interface FantasyLeague {
    leagueId: string;
    name: string;
    platform: string;
    totalTeams: number;
    isActive: boolean;
    currentWeek: number;
    seasonType: string;
    year: number;
}

export interface ScoringRules {
    leagueId: string;
    rules: Record<string, number>;
}

export interface RawStats {
    [key: string]: number;
}

export interface ScoringRules {
    [statId: string]: ScoringRule;
}

export interface ScoringRule {
    points: number;
    bonuses?: BonusRule[];
    group: string;
    statName?: string;
}

export interface BonusRule {
    bonus: {
        target: number;
        points: number;
    };
}

export interface LeagueSettings {
    leagueId: string;
    leagueName: string;
    scoringRules: ScoringRules;
    rosterPositions: string[];
    playoffWeeks: number[];
    tradeDeadline: string;
    waiverType: string;
    waiverTime: number;
    maxAcquisitions: number;
    isPublic: boolean;
}

export interface TeamInfo {
    teamName: string;
    teamId: string;
    managerId: string;
    managerName: string;
    isOwned: boolean;
    wins: number;
    losses: number;
    ties: number;
    pointsFor: number;
    pointsAgainst: number;
    currentRank: number;
    playoffSeed?: number;
    logoUrl?: string;
}