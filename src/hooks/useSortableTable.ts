// src/hooks/useSortableTable.ts - TABLE SORTING HOOK
import { useState, useMemo, useCallback } from 'react';
import { SortConfig } from '../types/player';

interface UseSortableTableReturn<T> {
   sortedData: T[];
   sortConfig: SortConfig;
   handleSort: (column: string) => void;
   resetSort: () => void;
}

export const useSortableTable = <T extends Record<string, any>>(
   data: T[], 
   defaultSort?: SortConfig
): UseSortableTableReturn<T> => {
   const [sortConfig, setSortConfig] = useState<SortConfig>(
       defaultSort || { column: null, direction: 'desc' }
   );

   const sortedData = useMemo(() => {
       if (!sortConfig.column || !data.length) {
           return data;
       }

       return [...data].sort((a, b) => {
           const aValue = a[sortConfig.column!];
           const bValue = b[sortConfig.column!];

           // Handle null/undefined values
           if (aValue === null || aValue === undefined) return 1;
           if (bValue === null || bValue === undefined) return -1;

           // Handle different data types
           let comparison = 0;

           if (typeof aValue === 'number' && typeof bValue === 'number') {
               comparison = aValue - bValue;
           } else if (typeof aValue === 'string' && typeof bValue === 'string') {
               comparison = aValue.localeCompare(bValue, undefined, { 
                   numeric: true, 
                   sensitivity: 'base' 
               });
           } else {
               // Convert to string for comparison
               const aStr = String(aValue).toLowerCase();
               const bStr = String(bValue).toLowerCase();
               comparison = aStr.localeCompare(bStr, undefined, { 
                   numeric: true, 
                   sensitivity: 'base' 
               });
           }

           return sortConfig.direction === 'asc' ? comparison : -comparison;
       });
   }, [data, sortConfig]);

   const handleSort = useCallback((column: string) => {
       setSortConfig(prevConfig => ({
           column,
           direction: prevConfig.column === column && prevConfig.direction === 'desc' ? 'asc' : 'desc'
       }));
   }, []);

   const resetSort = useCallback(() => {
       setSortConfig({ column: null, direction: 'desc' });
   }, []);

   return {
       sortedData,
       sortConfig,
       handleSort,
       resetSort
   };
};
