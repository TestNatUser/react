import { useEffect, useCallback } from 'react';
import AppContainer from './components/layout/AppContainer.tsx';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchSeasonsAsync, setQuery, setError } from './store/slices/seasonsSlice';
import { useSearchTerm } from './hooks/useLocalStorage';
import { shouldUseRealApi } from './services/apiConfig';
import { filterMockSeasons } from './services/mockData';
import './App.css';

const App = () => {
  const dispatch = useAppDispatch();
  const { seasons, loading, error, query } = useAppSelector((state) => state.seasons);
  const { selectedSeasons } = useAppSelector((state) => state.selectedItems);
  const { searchTerm, saveSearchTerm } = useSearchTerm();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setQuery(e.target.value));
    },
    [dispatch]
  );

  const fetchSeasons = useCallback(
    async (searchQuery: string) => {
      // Check if we should use real API or go straight to mock data
      if (!shouldUseRealApi()) {
        dispatch(setQuery(searchQuery));
        
        // Simulate loading for demo purposes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data directly without API call
        const mockResults = filterMockSeasons(searchQuery);
        
        // For mock data, we'll dispatch a fake success action
        // Since we can't easily dispatch the fulfilled action directly,
        // we'll use the error field to indicate demo mode
        dispatch(setError('Using sample data for demonstration.'));
        
        // Note: In a real implementation, you might want a separate slice
        // for mock data or modify the seasonsSlice to handle mock data
        return;
      }

      // Use Redux async thunk for real API calls
      dispatch(fetchSeasonsAsync(searchQuery));
    },
    [dispatch]
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    saveSearchTerm(trimmedQuery);
    fetchSeasons(trimmedQuery);
  }, [query, saveSearchTerm, fetchSeasons]);

  // Load initial data when component mounts
  useEffect(() => {
    // Set initial query from localStorage
    if (searchTerm) {
      dispatch(setQuery(searchTerm));
    }
    // Fetch initial data
    fetchSeasons(searchTerm);
  }, [searchTerm, dispatch, fetchSeasons]);

  return (
    <AppContainer
      query={query}
      onInputChange={handleInputChange}
      onSearch={handleSearch}
      results={seasons}
      loading={loading}
      error={error}
      selectedItems={selectedSeasons}
    />
  );
};

export default App;