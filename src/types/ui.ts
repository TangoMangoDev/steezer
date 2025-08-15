// src/types/ui.ts - UI STATE TYPES
export type ViewMode = 'cards' | 'research' | 'stats';
export type RosterTab = 'owned' | 'available' | 'weekly' | 'metrics';

export interface UIState {
    currentView: ViewMode;
    activeTab: RosterTab;
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    selectedPlayers: string[];
    expandedCards: string[];
}

export interface FilterState {
    position: string;
    team: string;
    week: string;
    year: string;
    league: string | null;
    minSnaps: number;
    maxRank: number;
    showInjured: boolean;
    showAvailable: boolean;
}

export interface AppState {
    ui: UIState;
    filters: FilterState;
    user: UserState;
    data: DataState;
}

export interface UserState {
    userId: string | null;
    isAuthenticated: boolean;
    activeLeagueId: string | null;
    preferences: UserPreferences;
}

export interface UserPreferences {
    defaultView: ViewMode;
    defaultPosition: string;
    autoRefresh: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
    compactView: boolean;
}

export interface DataState {
    players: Player[];
    rosters: { [leagueId: string]: { [week: number]: RosterData } };
    leagues: FantasyLeague[];
    scoringRules: { [leagueId: string]: ScoringRules };
    lastUpdated: { [key: string]: string };
    cache: { [key: string]: any };
}