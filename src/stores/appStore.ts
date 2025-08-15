// src/stores/appStore.ts - Fixed imports and types
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
    Player, 
    PlayerFilters, 
    ViewMode, 
    RosterTab,
    FantasyLeague, 
    ScoringRules 
} from '../types/player';
import { RosterData } from '../types/roster';

interface PlayerState {
    players: Player[];
    selectedPlayer: Player | null;
    filters: PlayerFilters;
    searchQuery: string;
    currentView: ViewMode;
    loading: boolean;
    error: string | null;
    currentPage: number;
    hasMore: boolean;
    totalRecords: number;
}

interface RosterState {
    rosterData: { [leagueId: string]: { [week: number]: RosterData } };
    activeTab: RosterTab;
    currentWeek: number;
    positionFilter: string;
    loading: boolean;
    error: string | null;
}

interface FantasyState {
    leagues: FantasyLeague[];
    activeLeagueId: string | null;
    scoringRules: { [leagueId: string]: ScoringRules };
    loading: boolean;
    error: string | null;
}

interface UIState {
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;
    theme: 'light' | 'dark';
    compactView: boolean;
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        timestamp: number;
    }>;
}

interface AppState extends PlayerState, RosterState, FantasyState, UIState {
    setPlayers: (players: Player[]) => void;
    selectPlayer: (player: Player | null) => void;
    setFilters: (filters: Partial<PlayerFilters>) => void;
    setSearchQuery: (query: string) => void;
    setCurrentView: (view: ViewMode) => void;
    setPlayerLoading: (loading: boolean) => void;
    setPlayerError: (error: string | null) => void;
    updatePagination: (page: number, hasMore: boolean, totalRecords: number) => void;
    setRosterData: (leagueId: string, week: number, data: RosterData) => void;
    setActiveTab: (tab: RosterTab) => void;
    setCurrentWeek: (week: number) => void;
    setPositionFilter: (position: string) => void;
    setRosterLoading: (loading: boolean) => void;
    setRosterError: (error: string | null) => void;
    setLeagues: (leagues: FantasyLeague[]) => void;
    setActiveLeague: (leagueId: string) => void;
    setScoringRules: (leagueId: string, rules: ScoringRules) => void;
    setFantasyLoading: (loading: boolean) => void;
    setFantasyError: (error: string | null) => void;
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setCompactView: (compact: boolean) => void;
    addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    reset: () => void;
    clearErrors: () => void;
}

const initialState = {
    players: [],
    selectedPlayer: null,
    filters: {
        year: '2024',
        week: 'total',
        position: 'ALL',
        league: undefined,
        team: 'ALL',
        searchQuery: ''
    },
    searchQuery: '',
    currentView: 'cards' as ViewMode,
    currentPage: 1,
    hasMore: false,
    totalRecords: 0,
    rosterData: {},
    activeTab: 'owned' as RosterTab,
    currentWeek: 1,
    positionFilter: 'ALL',
    leagues: [],
    activeLeagueId: null,
    scoringRules: {},
    sidebarOpen: false,
    mobileMenuOpen: false,
    theme: 'light' as const,
    compactView: false,
    notifications: [],
    loading: false,
    error: null
};

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                setPlayers: (players) => set({ players }),
                selectPlayer: (player) => set({ selectedPlayer: player }),
                setFilters: (newFilters) => set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                    currentPage: 1,
                    hasMore: false
                })),
                setSearchQuery: (query) => set({ 
                    searchQuery: query,
                    currentPage: 1,
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
                setLeagues: (leagues) => set({ 
                    leagues,
                    activeLeagueId: get().activeLeagueId || (leagues.length > 0 ? leagues[0].leagueId : null)
                }),
                setActiveLeague: (leagueId) => {
                    set({ activeLeagueId: leagueId });
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
                reset: () => set(initialState),
                clearErrors: () => set({ error: null })
            }),
            {
                name: 'fantasy-app-storage',
                partialize: (state) => ({
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