// src/stores/playerStore.ts - Fixed
import { create } from 'zustand';
import { Player, PlayerFilters, ViewMode } from '../types/player';

interface PlayerStore {
    filters: PlayerFilters;
    currentView: ViewMode;
    searchQuery: string;
    selectedPlayer: Player | null;
    setFilters: (filters: Partial<PlayerFilters>) => void;
    setView: (view: ViewMode) => void;
    setSearch: (query: string) => void;
    selectPlayer: (player: Player) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    filters: {
        week: 'total',
        position: 'ALL',
        league: undefined,
        year: '2024',
        team: 'ALL',
        searchQuery: ''
    },
    currentView: 'cards',
    searchQuery: '',
    selectedPlayer: null,
    setFilters: (newFilters) => 
        set((state) => ({ 
            filters: { ...state.filters, ...newFilters } 
        })),
    setView: (view) => set({ currentView: view }),
    setSearch: (query) => set({ searchQuery: query }),
    selectPlayer: (player) => set({ selectedPlayer: player })
}));