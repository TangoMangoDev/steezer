// src/hooks/usePlayersData.ts - COMPLETE DATA FETCHING HOOK
import { useState, useEffect, useCallback, useRef } from 'react';
import { Player, PlayerFilters, PlayerAPIResponse } from '../types/player';
import { statsAPI } from '../services/statsAPI';

interface UsePlayersDataReturn {
   data: Player[];
   loading: boolean;
   error: string | null;
   refetch: () => Promise<void>;
   hasMore: boolean;
   loadMore: () => Promise<void>;
   pagination: {
       currentPage: number;
       totalPages: number;
       totalRecords: number;
   };
}

export const usePlayersData = (filters: PlayerFilters, limit: number = 50): UsePlayersDataReturn => {
   const [data, setData] = useState<Player[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [hasMore, setHasMore] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalRecords, setTotalRecords] = useState(0);

   const abortControllerRef = useRef<AbortController | null>(null);
   const filtersRef = useRef<PlayerFilters>(filters);

   const fetchData = useCallback(async (page: number = 1, append: boolean = false) => {
       // Cancel previous request if still pending
       if (abortControllerRef.current) {
           abortControllerRef.current.abort();
       }

       abortControllerRef.current = new AbortController();

       try {
           setLoading(true);
           setError(null);

           console.log(`🔄 Fetching players: page ${page}, append: ${append}`, filters);

           const response: PlayerAPIResponse = await statsAPI.getPlayersForDisplay(
               filters.year,
               filters.week,
               filters.position,
               limit,
               page
           );

           if (!response.success || !response.data) {
               throw new Error(response.error || 'Failed to fetch players');
           }

           const newData = response.data;

           if (append) {
               setData(prevData => [...prevData, ...newData]);
           } else {
               setData(newData);
               setCurrentPage(1);
           }

           // Update pagination info
           if (response.pagination) {
               setTotalPages(response.pagination.totalPages);
               setTotalRecords(response.pagination.totalRecords);
               setHasMore(response.pagination.hasMore);
               if (!append) {
                   setCurrentPage(response.pagination.currentPage);
               }
           } else {
               setHasMore(false);
               setTotalPages(1);
               setTotalRecords(newData.length);
           }

           console.log(`✅ Loaded ${newData.length} players, total: ${append ? data.length + newData.length : newData.length}`);

       } catch (err: any) {
           if (err.name !== 'AbortError') {
               console.error('❌ Error fetching players:', err);
               setError(err.message || 'Failed to fetch players');
               if (!append) {
                   setData([]);
               }
           }
       } finally {
           setLoading(false);
       }
   }, [filters.year, filters.week, filters.position, limit]);

   const loadMore = useCallback(async () => {
       if (!hasMore || loading) return;

       const nextPage = currentPage + 1;
       await fetchData(nextPage, true);
       setCurrentPage(nextPage);
   }, [hasMore, loading, currentPage, fetchData]);

   const refetch = useCallback(async () => {
       await fetchData(1, false);
   }, [fetchData]);

   // Effect to fetch data when filters change
   useEffect(() => {
       const filtersChanged = JSON.stringify(filtersRef.current) !== JSON.stringify(filters);
       filtersRef.current = filters;

       if (filtersChanged) {
           fetchData(1, false);
       }
   }, [filters, fetchData]);

   // Cleanup on unmount
   useEffect(() => {
       return () => {
           if (abortControllerRef.current) {
               abortControllerRef.current.abort();
           }
       };
   }, []);

   return {
       data,
       loading,
       error,
       refetch,
       hasMore,
       loadMore,
       pagination: {
           currentPage,
           totalPages,
           totalRecords
       }
   };
};







