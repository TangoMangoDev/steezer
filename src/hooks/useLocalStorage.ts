// src/hooks/useLocalStorage.ts - LOCAL STORAGE HOOK
import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = <T>(key: string, defaultValue: T): [T, (value: T) => void] => {
   const [value, setValue] = useState<T>(() => {
       try {
           const item = localStorage.getItem(key);
           return item ? JSON.parse(item) : defaultValue;
       } catch (error) {
           console.warn(`Error reading localStorage key "${key}":`, error);
           return defaultValue;
       }
   });

   const setStoredValue = useCallback((newValue: T) => {
       try {
           setValue(newValue);
           localStorage.setItem(key, JSON.stringify(newValue));
       } catch (error) {
           console.warn(`Error setting localStorage key "${key}":`, error);
       }
   }, [key]);

   return [value, setStoredValue];
};