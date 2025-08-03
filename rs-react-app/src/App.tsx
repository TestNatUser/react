import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppContainer from './components/layout/AppContainer.tsx';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchSeasonsAsync, setQuery, setSeasons, setLoading, setCurrentPage } from './store/slices/seasonsSlice';
import { useSearchTerm } from './hooks/useLocalStorage';
import { shouldUseRealApi } from './services/apiConfig';
import { filterMockSeasons } from './services/mockData';
import { getPageFromUrl, updateUrlWithPage, getPaginatedItems } from './utils/pagination';
import './App.css';

const App = () => {
  const dispatch = useAppDispatch();
  const { seasons, loading, error, query, pagination } = useAppSelector((state) => state.seasons);
  const { selectedSeasons } = useAppSelector((state) => state.selectedItems);
  const { searchTerm, saveSearchTerm } = useSearchTerm();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setQuery(e.target.value));
    },
    [dispatch]
  );

  const fetchSeasons = useCallback(
    async (searchQuery: string, page: number = 1) => {
      // Check if we should use real API or go straight to mock data
      if (!shouldUseRealApi()) {
        dispatch(setLoading(true));
        
        // Simulate loading for demo purposes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data and set it in the store
        const allMockResults = filterMockSeasons(searchQuery);
        dispatch(setSeasons({ 
          seasons: allMockResults, 
          error: 'Using sample data for demonstration.',
          currentPage: page
        }));
        return;
      }

      // Use Redux async thunk for real API calls
      dispatch(fetchSeasonsAsync({ query: searchQuery, page }));
    },
    [dispatch]
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    saveSearchTerm(trimmedQuery);
    // Reset to page 1 when performing a new search
    updateUrlWithPage(1, searchParams, setSearchParams);
    fetchSeasons(trimmedQuery, 1);
  }, [query, saveSearchTerm, fetchSeasons, searchParams, setSearchParams]);

  const handlePageChange = useCallback((page: number) => {
    updateUrlWithPage(page, searchParams, setSearchParams);
    dispatch(setCurrentPage(page));
  }, [dispatch, searchParams, setSearchParams]);

  // Load initial data when component mounts
  useEffect(() => {
    // Get page from URL
    const currentPage = getPageFromUrl(searchParams);
    
    // Set initial query from localStorage
    if (searchTerm) {
      dispatch(setQuery(searchTerm));
    }
    
    // Set current page
    dispatch(setCurrentPage(currentPage));
    
    // Fetch initial data
    fetchSeasons(searchTerm, currentPage);
  }, [searchTerm, dispatch, fetchSeasons, searchParams]);

  // Get paginated results for display
  const { paginatedItems: paginatedSeasons } = getPaginatedItems(
    seasons,
    pagination.currentPage,
    pagination.itemsPerPage
  );

  return (
    <AppContainer
      query={query}
      onInputChange={handleInputChange}
      onSearch={handleSearch}
      results={paginatedSeasons}
      loading={loading}
      error={error}
      selectedItems={selectedSeasons}
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  );
};

export default App;