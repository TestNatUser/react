import { useState, useEffect, useCallback } from 'react';
import type { AppState } from './interfaces/interface';
import AppContainer from './components/layout/AppContainer.tsx';
import { createSeasonService } from './services/services';
import { useSearchTerm } from './hooks/useLocalStorage';
import './App.css';

const App = () => {
  const { searchTerm, saveSearchTerm } = useSearchTerm();

  const [state, setState] = useState<AppState>({
    query: searchTerm,
    results: [],
    error: null,
    loading: false,
  });

  // Create a mock component-like object for the service
  const mockComponent = {
    state,
    setState: (newState: Partial<AppState>) => {
      setState((prevState) => ({ ...prevState, ...newState }));
    },
  };

  const service = createSeasonService(mockComponent);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => ({ ...prevState, query: e.target.value }));
    },
    []
  );

  const fetchSeasons = useCallback(
    async (query: string) => {
      await service.fetchSeasons(query);
    },
    [service]
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = state.query.trim();
    saveSearchTerm(trimmedQuery);
    fetchSeasons(trimmedQuery);
  }, [state.query, saveSearchTerm, fetchSeasons]);

  const load = useCallback(() => {
    const trimmedQuery = state.query.trim();
    fetchSeasons(trimmedQuery);
  }, [state.query, fetchSeasons]);

  useEffect(() => {
    load();
  }, [load]);

  const { query, results, loading } = state;

  return (
    <AppContainer
      query={query}
      onInputChange={handleInputChange}
      onSearch={handleSearch}
      results={results}
      loading={loading}
    />
  );
};

export default App;
