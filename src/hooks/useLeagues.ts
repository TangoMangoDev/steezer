// src/hooks/useLeagues.ts - FANTASY LEAGUES HOOK
import { useState, useEffect, useCallback } from 'react';
import { FantasyLeague } from '../types/fantasy';
import { fantasyAPI } from '../services/fantasyAPI';

interface UseLeaguesReturn {
   leagues: FantasyLeague[];
   loading: boolean;
   error: string | null;
   refetch: () => Promise<void>;
   importLeagues: (leagueIds: string[]) => Promise<void>;
   importing: boolean;
}

export const useLeagues = (): UseLeaguesReturn => {
   const [leagues, setLeagues] = useState<FantasyLeague[]>([]);
   const [loading, setLoading] = useState(false);
   const [importing, setImporting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const fetchLeagues = useCallback(async () => {
       setLoading(true);
       setError(null);

       try {
           console.log('🔄 Fetching user leagues');

           const data = await fantasyAPI.getLeagues();
           setLeagues(data);

           // Set default active league if none selected
           if (data.length > 0 && !localStorage.getItem('activeLeagueId')) {
               localStorage.setItem('activeLeagueId', data[0].leagueId);
           }

           console.log(`✅ Loaded ${data.length} leagues`);
       } catch (err: any) {
           console.error('❌ Error fetching leagues:', err);
           setError(err.message || 'Failed to fetch leagues');
           setLeagues([]);
       } finally {
           setLoading(false);
       }
   }, []);

   const importLeagues = useCallback(async (leagueIds: string[]) => {
       setImporting(true);
       setError(null);

       try {
           console.log(`🔄 Importing ${leagueIds.length} leagues`);

           const result = await fantasyAPI.importLeagues(leagueIds);

           console.log(`✅ Successfully imported ${result.importedCount} leagues`);

           // Refresh leagues after import
           await fetchLeagues();

       } catch (err: any) {
           console.error('❌ Error importing leagues:', err);
           setError(err.message || 'Failed to import leagues');
       } finally {
           setImporting(false);
       }
   }, [fetchLeagues]);

   const refetch = useCallback(async () => {
       await fetchLeagues();
   }, [fetchLeagues]);

   useEffect(() => {
       fetchLeagues();
   }, [fetchLeagues]);

   return {
       leagues,
       loading,
       error,
       refetch,
       importLeagues,
       importing
   };
};