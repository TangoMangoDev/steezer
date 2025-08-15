
import { Player, PlayerFilters } from './player';
import { FantasyLeague, ScoringRules } from './fantasy';
import { RosterData } from './roster';

export type ViewMode = 'table' | 'grid';

export interface SortConfig {
    column: string | null;
    direction: 'asc' | 'desc';
}

export interface TableColumn<T = any> {
    key: string;
    title: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
}

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface PositionFilterProps {
    selectedPosition: string;
    onPositionChange: (position: string) => void;
    positions: string[];
}

export interface ViewToggleProps {
    currentView: ViewMode;
    onChange: (view: ViewMode) => void;
}

export type RosterTab = 'owned' | 'available' | 'weekly-logs' | 'metrics';

export interface TabConfig {
    id: string;
    label: string;
    component: React.ComponentType<any>;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasMore: boolean;
}

export interface PlayerStats {
    week: number;
    fantasyPoints: number;
    passingYards?: number;
    touchdowns?: number;
    // Add other stats as needed
}

export interface AppState {
    // UI State
    isLoading: boolean;
    error: string | null;
    currentView: ViewMode;
    
    // Data State
    players: Player[];
    rosters: { [leagueId: string]: { [week: number]: RosterData } };
    leagues: FantasyLeague[];
    scoringRules: { [leagueId: string]: ScoringRules };
    
    // Filter State
    filters: PlayerFilters;
    searchQuery: string;
    selectedPosition: string;
    
    // Pagination State
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasMore: boolean;
    
    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCurrentView: (view: ViewMode) => void;
    setPlayers: (players: Player[]) => void;
    setFilters: (filters: Partial<PlayerFilters>) => void;
    setSearchQuery: (query: string) => void;
    setSelectedPosition: (position: string) => void;
    setPagination: (pagination: Partial<PaginationInfo>) => void;
    clearFilters: () => void;
}

// Re-export types for convenience
export type { Player, PlayerFilters, FantasyLeague, ScoringRules, RosterData };
