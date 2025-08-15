// src/stores/appStore.ts - COMPLETE APPLICATION STATE MANAGEMENT
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
    Player, 
    PlayerFilters, 
    ViewMode, 
    RosterTab, 
    FantasyLeague, 
    RosterData,
    ScoringRules 
} from '../types/ui';

interface PlayerState {
    // Data
    players: Player[];
    selectedPlayer: Player | null;

    // Filters
    filters: PlayerFilters;
    searchQuery: string;

    // UI
    currentView: ViewMode;
    loading: boolean;
    error: string | null;

    // Pagination
    currentPage: number;
    hasMore: boolean;
    totalRecords: number;
}

interface RosterState {
    // Data
    rosterData: { [leagueId: string]: { [week: number]: RosterData } };

    // UI
    activeTab: RosterTab;
    currentWeek: number;
    positionFilter: string;
    loading: boolean;
    error: string | null;
}

interface FantasyState {
    // Data
    leagues: FantasyLeague[];
    activeLeagueId: string | null;
    scoringRules: { [leagueId: string]: ScoringRules };

    // UI
    loading: boolean;
    error: string | null;
}

interface UIState {
    // Layout
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;

    // Theme
    theme: 'light' | 'dark';
    compactView: boolean;

    // Notifications
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        timestamp: number;
    }>;
}

interface AppState extends PlayerState, RosterState, FantasyState, UIState {
    // Player Actions
    setPlayers: (players: Player[]) => void;
    selectPlayer: (player: Player | null) => void;
    setFilters: (filters: Partial<PlayerFilters>) => void;
    setSearchQuery: (query: string) => void;
    setCurrentView: (view: ViewMode) => void;
    setPlayerLoading: (loading: boolean) => void;
    setPlayerError: (error: string | null) => void;
    updatePagination: (page: number, hasMore: boolean, totalRecords: number) => void;

    // Roster Actions
    setRosterData: (leagueId: string, week: number, data: RosterData) => void;
    setActiveTab: (tab: RosterTab) => void;
    setCurrentWeek: (week: number) => void;
    setPositionFilter: (position: string) => void;
    setRosterLoading: (loading: boolean) => void;
    setRosterError: (error: string | null) => void;

    // Fantasy Actions
    setLeagues: (leagues: FantasyLeague[]) => void;
    setActiveLeague: (leagueId: string) => void;
    setScoringRules: (leagueId: string, rules: ScoringRules) => void;
    setFantasyLoading: (loading: boolean) => void;
    setFantasyError: (error: string | null) => void;

    // UI Actions
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setCompactView: (compact: boolean) => void;
    addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;

    // Utility Actions
    reset: () => void;
    clearErrors: () => void;
}

const initialState = {
    // Player State
    players: [],
    selectedPlayer: null,
    filters: {
        year: '2024',
        week: 'total',
        position: 'ALL',
        league: null,
        team: 'ALL'
    },
    searchQuery: '',
    currentView: 'cards' as ViewMode,
    currentPage: 1,
    hasMore: false,
    totalRecords: 0,

    // Roster State
    rosterData: {},
    activeTab: 'owned' as RosterTab,
    currentWeek: 1,
    positionFilter: 'ALL',

    // Fantasy State
    leagues: [],
    activeLeagueId: null,
    scoringRules: {},

    // UI State
    sidebarOpen: false,
    mobileMenuOpen: false,
    theme: 'light' as const,
    compactView: false,
    notifications: [],

    // Loading/Error States
    loading: false,
    error: null
};

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Player Actions
                setPlayers: (players) => set({ players }),

                selectPlayer: (player) => set({ selectedPlayer: player }),

                setFilters: (newFilters) => set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                    currentPage: 1, // Reset pagination when filters change
                    hasMore: false
                })),

                setSearchQuery: (query) => set({ 
                    searchQuery: query,
                    currentPage: 1, // Reset pagination when search changes
                    hasMore: false
                }),

                setCurrentView: (view) => set({ currentView: view }),

                setPlayerLoading: (loading) => set({ loading }),

                setPlayerError: (error) => set({ error }),

                updatePagination: (page, hasMore, totalRecords) => set({
                    currentPage: page,
                    hasMore,
                    totalRecords
                }),

                // Roster Actions
                setRosterData: (leagueId, week, data) => set((state) => ({
                    rosterData: {
                        ...state.rosterData,
                        [leagueId]: {
                            ...state.rosterData[leagueId],
                            [week]: data
                        }
                    }
                })),

                setActiveTab: (tab) => set({ activeTab: tab }),

                setCurrentWeek: (week) => set({ currentWeek: week }),

                setPositionFilter: (position) => set({ positionFilter: position }),

                setRosterLoading: (loading) => set({ loading }),

                setRosterError: (error) => set({ error }),

                // Fantasy Actions
                setLeagues: (leagues) => set({ 
                    leagues,
                    // Set first league as active if none selected
                    activeLeagueId: get().activeLeagueId || (leagues.length > 0 ? leagues[0].leagueId : null)
                }),

                setActiveLeague: (leagueId) => {
                    set({ activeLeagueId: leagueId });
                    // Also store in localStorage for persistence
                    localStorage.setItem('activeLeagueId', leagueId);
                },

                setScoringRules: (leagueId, rules) => set((state) => ({
                    scoringRules: {
                        ...state.scoringRules,
                        [leagueId]: rules
                    }
                })),

                setFantasyLoading: (loading) => set({ loading }),

                setFantasyError: (error) => set({ error }),

                // UI Actions
                toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

                toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

                setTheme: (theme) => set({ theme }),

                setCompactView: (compact) => set({ compactView: compact }),

                addNotification: (notification) => set((state) => ({
                    notifications: [
                        ...state.notifications,
                        {
                            ...notification,
                            id: Date.now().toString(),
                            timestamp: Date.now()
                        }
                    ]
                })),

                removeNotification: (id) => set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id)
                })),

                clearNotifications: () => set({ notifications: [] }),

                // Utility Actions
                reset: () => set(initialState),

                clearErrors: () => set({ error: null })
            }),
            {
                name: 'fantasy-app-storage',
                partialize: (state) => ({
                    // Only persist certain state
                    filters: state.filters,
                    currentView: state.currentView,
                    activeTab: state.activeTab,
                    currentWeek: state.currentWeek,
                    positionFilter: state.positionFilter,
                    activeLeagueId: state.activeLeagueId,
                    theme: state.theme,
                    compactView: state.compactView
                })
            }
        ),
        { name: 'fantasy-app-store' }
    )
);

// Selector hooks for optimized re-renders
export const usePlayerState = () => useAppStore((state) => ({
    players: state.players,
    selectedPlayer: state.selectedPlayer,
    filters: state.filters,
    searchQuery: state.searchQuery,
    currentView: state.currentView,
    loading: state.loading,
    error: state.error,
    currentPage: state.currentPage,
    hasMore: state.hasMore,
    totalRecords: state.totalRecords
}));

export const useRosterState = () => useAppStore((state) => ({
    rosterData: state.rosterData,
    activeTab: state.activeTab,
    currentWeek: state.currentWeek,
    positionFilter: state.positionFilter,
    loading: state.loading,
    error: state.error
}));

export const useFantasyState = () => useAppStore((state) => ({
    leagues: state.leagues,
    activeLeagueId: state.activeLeagueId,
    scoringRules: state.scoringRules,
    loading: state.loading,
    error: state.error
}));

export const useUIState = () => useAppStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    mobileMenuOpen: state.mobileMenuOpen,
    theme: state.theme,
    compactView: state.compactView,
    notifications: state.notifications
}));

export const usePlayerActions = () => useAppStore((state) => ({
    setPlayers: state.setPlayers,
    selectPlayer: state.selectPlayer,
    setFilters: state.setFilters,
    setSearchQuery: state.setSearchQuery,
    setCurrentView: state.setCurrentView,
    setPlayerLoading: state.setPlayerLoading,
    setPlayerError: state.setPlayerError,
    updatePagination: state.updatePagination
}));

export const useRosterActions = () => useAppStore((state) => ({
    setRosterData: state.setRosterData,
    setActiveTab: state.setActiveTab,
    setCurrentWeek: state.setCurrentWeek,
    setPositionFilter: state.setPositionFilter,
    setRosterLoading: state.setRosterLoading,
    setRosterError: state.setRosterError
}));

export const useFantasyActions = () => useAppStore((state) => ({
    setLeagues: state.setLeagues,
    setActiveLeague: state.setActiveLeague,
    setScoringRules: state.setScoringRules,
    setFantasyLoading: state.setFantasyLoading,
    setFantasyError: state.setFantasyError
}));

export const useUIActions = () => useAppStore((state) => ({
    toggleSidebar: state.toggleSidebar,
    toggleMobileMenu: state.toggleMobileMenu,
    setTheme: state.setTheme,
    setCompactView: state.setCompactView,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
    reset: state.reset,
    clearErrors: state.clearErrors
}));