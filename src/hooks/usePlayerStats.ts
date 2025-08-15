// src/hooks/usePlayerStats.ts - INDIVIDUAL PLAYER STATS HOOK
import { useState, useEffect, useCallback } from 'react';
import { PlayerCompleteData } from '../types/player';
import { statsAPI } from '../services/statsAPI';

interface UsePlayerStatsReturn {
   playerData: PlayerCompleteData | null;
   loading: boolean;
   error: string | null;
   refetch: () => Promise<void>;
}

export const usePlayerStats = (playerId: string, selectedWeek = 'total'): UsePlayerStatsReturn => {
   const [playerData, setPlayerData] = useState<PlayerCompleteData | null>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const fetchPlayerData = useCallback(async () => {
       if (!playerId) return;

       setLoading(true);
       setError(null);

       try {
           console.log(`🔄 Fetching player data for ${playerId}`);

           const data = await statsAPI.getPlayerStats(playerId);
           setPlayerData(data);

           console.log(`✅ Loaded player data for ${data.playerName}`);
       } catch (err: any) {
           console.error(`❌ Error fetching player ${playerId}:`, err);
           setError(err.message || 'Failed to fetch player data');
           setPlayerData(null);
       } finally {
           setLoading(false);
       }
   }, [playerId]);

   const refetch = useCallback(async () => {
       await fetchPlayerData();
   }, [fetchPlayerData]);

   useEffect(() => {
       fetchPlayerData();
   }, [fetchPlayerData]);

   return {
       playerData,
       loading,
       error,
       refetch
   };
};




