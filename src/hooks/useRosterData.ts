// src/hooks/useRosterData.ts - Fixed
import { useState, useEffect, useCallback } from 'react';
import { RosterData } from '../types/roster';
import { fantasyAPI } from '../services/fantasyAPI';

interface UseRosterDataReturn {
   rosterData: RosterData | null;
   loading: boolean;
   error: string | null;
   refetch: () => Promise<void>;
   allWeeksData: { [week: number]: RosterData };
   loadAllWeeks: () => Promise<void>;
}

export const useRosterData = (currentWeek: number, leagueId?: string): UseRosterDataReturn => {
   const [rosterData, setRosterData] = useState<RosterData | null>(null);
   const [allWeeksData, setAllWeeksData] = useState<{ [week: number]: RosterData }>({});
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const activeLeagueId = leagueId || localStorage.getItem('activeLeagueId');

   const fetchRosterData = useCallback(async () => {
       if (!activeLeagueId || !currentWeek) return;

       setLoading(true);
       setError(null);

       try {
           console.log(`🔄 Fetching roster data for league ${activeLeagueId} week ${currentWeek}`);

           const data = await fantasyAPI.getRosterData(activeLeagueId, currentWeek);
           setRosterData(data);

           setAllWeeksData(prev => ({
               ...prev,
               [currentWeek]: data
           }));

           console.log(`✅ Loaded roster data: ${data.totalPlayers} players`);
       } catch (err: any) {
           console.error(`❌ Error fetching roster data:`, err);
           setError(err.message || 'Failed to fetch roster data');
           setRosterData(null);
       } finally {
           setLoading(false);
       }
   }, [activeLeagueId, currentWeek]);

   const loadAllWeeks = useCallback(async () => {
       if (!activeLeagueId) return;

       setLoading(true);
       setError(null);

       try {
           console.log(`🔄 Fetching all roster data for league ${activeLeagueId}`);

           const allData = await fantasyAPI.getAllRostersForLeague(activeLeagueId);
           setAllWeeksData(allData);

           if (allData[currentWeek]) {
               setRosterData(allData[currentWeek]);
           }

           console.log(`✅ Loaded roster data for ${Object.keys(allData).length} weeks`);
       } catch (err: any) {
           console.error(`❌ Error fetching all roster data:`, err);
           setError(err.message || 'Failed to fetch roster data');
       } finally {
           setLoading(false);
       }
   }, [activeLeagueId, currentWeek]);

   const refetch = useCallback(async () => {
       await fetchRosterData();
   }, [fetchRosterData]);

   useEffect(() => {
       fetchRosterData();
   }, [fetchRosterData]);

   return {
       rosterData,
       loading,
       error,
       refetch,
       allWeeksData,
       loadAllWeeks
   };
};