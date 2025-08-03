import { useState, useCallback } from 'react';

/**
 * Custom hook for localStorage operations
 * Provides type-safe localStorage with error handling and state management
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void, boolean] {
  // Check if localStorage is available
  const isAvailable = useCallback((): boolean => {
    try {
      const test = '__localStorage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }, []);

  // State to store our value with initial value from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isAvailable()) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (isAvailable()) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Failed to save to localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, isAvailable]
  );

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (isAvailable()) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Failed to remove localStorage key "${key}":`, error);
    }
  }, [key, initialValue, isAvailable]);

  return [storedValue, setValue, removeValue, isAvailable()];
}

/**
 * Simplified hook specifically for search term functionality
 */
export function useSearchTerm() {
  const [searchTerm, setSearchTerm, clearSearchTerm, isAvailable] =
    useLocalStorage<string>('season-search-term', '');

  const saveSearchTerm = useCallback(
    (term: string) => {
      setSearchTerm(term.trim());
    },
    [setSearchTerm]
  );

  return {
    searchTerm,
    saveSearchTerm,
    clearSearchTerm,
    isLocalStorageAvailable: isAvailable,
  };
}
