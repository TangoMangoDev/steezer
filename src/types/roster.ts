// src/types/roster.ts - Complete roster types
export interface RosterData {
    Owned: { [teamName: string]: RosterPlayer[] };
    NotOwned: { [teamName: string]: RosterPlayer[] };
    week: number;
    totalTeams: number;
    totalPlayers: number;
    timestamp?: string;
}

export interface RosterPlayer {
    playerId: string;
    name: string;
    position: string;
    team: string;
    isOwned: boolean;
    teamName?: string;
    projection?: number;
    actual?: number;
    consistency?: number;
    trend?: 'up' | 'down';
    stats?: { [statId: string]: number };
    fantasyPoints?: number;
    weeklyPoints?: number[];
    averagePoints?: number;
    lastThreeGames?: number[];
    upcomingMatchup?: string;
    injuryStatus?: string;
}

export interface TeamRoster {
    teamName: string;
    teamId: string;
    isOwned: boolean;
    players: RosterPlayer[];
    totalPoints?: number;
    projectedPoints?: number;
    wins?: number;
    losses?: number;
    pointsFor?: number;
    pointsAgainst?: number;
}

// Export additional types that were missing
export type RosterTab = 'owned' | 'available' | 'weekly' | 'metrics';