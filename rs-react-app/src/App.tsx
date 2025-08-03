import { useState, useEffect, useCallback, useRef } from 'react';
import type { AppState } from './interfaces/interface';
import AppContainer from './components/layout/AppContainer.tsx';
import { createSeasonService } from './services/services';
import { filterMockSeasons } from './services/mockData';
import { shouldUseRealApi } from './services/apiConfig';
import { useSearchTerm } from './hooks/useLocalStorage';
import './App.css';

const App = () => {
  const { searchTerm, saveSearchTerm } = useSearchTerm();
  const serviceRef = useRef<ReturnType<typeof createSeasonService> | null>(
    null
  );
  const stateRef = useRef<AppState | undefined>(undefined);

  const [state, setState] = useState<AppState>({
    query: searchTerm,
    results: [],
    error: null,
    loading: false,
  });

  // Keep stateRef current
  stateRef.current = state;

  // Initialize service for tests and API usage (stable reference)
  const getService = useCallback(() => {
    if (!serviceRef.current) {
      const mockComponent = {
        get state() {
          return stateRef.current || state;
        },
        setState: (newState: Partial<AppState>) => {
          setState((prevState) => ({ ...prevState, ...newState }));
        },
      };
      serviceRef.current = createSeasonService(mockComponent);
    }
    return serviceRef.current;
  }, []); // Empty dependencies for stable reference

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => ({ ...prevState, query: e.target.value }));
    },
    []
  );

  const fetchSeasons = useCallback(
    async (query: string) => {
      // Check if we should use real API or go straight to mock data
      if (!shouldUseRealApi()) {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
          results: [],
        }));
        
        // Add a small delay to show the loader when using mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data directly without API call
        const mockResults = filterMockSeasons(query);
        setState((prev) => ({
          ...prev,
          results: mockResults,
          loading: false,
          error: 'Using sample data for demonstration.',
        }));
        return;
      }

      // Use service layer for real API calls (including tests)
      const service = getService();
      await service.fetchSeasons(query);
    },
    [getService]
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = state.query.trim();
    saveSearchTerm(trimmedQuery);
    fetchSeasons(trimmedQuery);
  }, [state.query, saveSearchTerm, fetchSeasons]);

  // Load initial data when component mounts (once only)
  useEffect(() => {
    // Use a ref to prevent stale closure
    const currentSearchTerm = searchTerm;
    fetchSeasons(currentSearchTerm);
  }, [fetchSeasons]); // fetchSeasons is stable

  const { query, results, loading, error } = state;

  return (
    <AppContainer
      query={query}
      onInputChange={handleInputChange}
      onSearch={handleSearch}
      results={results}
      loading={loading}
      error={error}
    />
  );
};

export default App;
