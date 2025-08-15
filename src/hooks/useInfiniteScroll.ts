// src/hooks/useInfiniteScroll.ts - INFINITE SCROLL HOOK
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollReturn {
   isFetching: boolean;
   setIsFetching: (fetching: boolean) => void;
}

export const useInfiniteScroll = (fetchMore: () => Promise<void>): UseInfiniteScrollReturn => {
   const [isFetching, setIsFetching] = useState(false);

   const handleScroll = useCallback(() => {
       if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) {
           return;
       }
       setIsFetching(true);
   }, [isFetching]);

   useEffect(() => {
       if (!isFetching) return;

       fetchMore().finally(() => {
           setIsFetching(false);
       });
   }, [isFetching, fetchMore]);

   useEffect(() => {
       window.addEventListener('scroll', handleScroll);
       return () => window.removeEventListener('scroll', handleScroll);
   }, [handleScroll]);

   return { isFetching, setIsFetching };
};