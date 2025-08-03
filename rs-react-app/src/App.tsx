import { useEffect, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import AppContainer from './components/layout/AppContainer.tsx';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchSeasonsAsync,
  setQuery,
  setSeasons,
  setLoading,
  setCurrentPage,
} from './store/slices/seasonsSlice';
import {
  fetchItemDetailsAsync,
  setItemDetails,
  closeDetails,
} from './store/slices/itemDetailsSlice';
import { useSearchTerm } from './hooks/useLocalStorage';
import { shouldUseRealApi } from './services/apiConfig';
import { filterMockSeasons } from './services/mockData';
import {
  getPageFromUrl,
  getPaginatedItems,
  getDetailsFromUrl,
} from './utils/pagination';
import type { Season } from './interfaces/interface';
import './App.css';

const App = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { seasons, loading, query, pagination } = useAppSelector(
    (state) => state.seasons
  );
  const { selectedSeasons } = useAppSelector((state) => state.selectedItems);
  const { isOpen: isDetailsOpen } = useAppSelector(
    (state) => state.itemDetails
  );
  const { searchTerm, saveSearchTerm } = useSearchTerm();
  const [searchParams] = useSearchParams();

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
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use mock data and set it in the store
        const allMockResults = filterMockSeasons(searchQuery);
        dispatch(
          setSeasons({
            seasons: allMockResults,
            error: 'Using sample data for demonstration.',
            currentPage: page,
          })
        );
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
    // Reset to page 1 and close details when performing a new search
    dispatch(closeDetails());
    navigate('/');
    fetchSeasons(trimmedQuery, 1);
  }, [query, saveSearchTerm, fetchSeasons, dispatch, navigate]);

  const handlePageChange = useCallback(
    (page: number) => {
      // For URL structure like /:page/:detailsId, update the route
      const currentDetailsId =
        params.detailsId || getDetailsFromUrl(searchParams);

      if (currentDetailsId) {
        navigate(`/${page}/${currentDetailsId}`);
      } else if (page > 1) {
        navigate(`/${page}`);
      } else {
        navigate('/');
      }

      dispatch(setCurrentPage(page));
    },
    [dispatch, navigate, params.detailsId, searchParams]
  );

  const handleItemClick = useCallback(
    (itemId: string, seasonData?: Season) => {
      const currentPage = pagination.currentPage;
      
      // Use the season data directly instead of fetching from API
      if (seasonData) {
        dispatch(setItemDetails(seasonData));
      } else {
        // Fallback to old method (mainly for tests)
        dispatch(fetchItemDetailsAsync(itemId));
      }

      // Update URL to include details
      if (currentPage > 1) {
        navigate(`/${currentPage}/${itemId}`);
      } else {
        navigate(`/1/${itemId}`);
      }
    },
    [dispatch, navigate, pagination.currentPage]
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(closeDetails());

    // Update URL to remove details
    const currentPage = pagination.currentPage;
    if (currentPage > 1) {
      navigate(`/${currentPage}`);
    } else {
      navigate('/');
    }
  }, [dispatch, navigate, pagination.currentPage]);

  // Load initial data when component mounts
  useEffect(() => {
    // Get page from URL params or query params
    const pageFromParams = params.page ? parseInt(params.page, 10) : null;
    const pageFromQuery = getPageFromUrl(searchParams);
    const currentPage = pageFromParams || pageFromQuery;

    // Get details ID from URL params


    // Set initial query from localStorage
    if (searchTerm) {
      dispatch(setQuery(searchTerm));
    }

    // Set current page
    dispatch(setCurrentPage(currentPage));

    // Fetch initial data
    fetchSeasons(searchTerm, currentPage);

    // Note: We don't automatically fetch details from URL since the API endpoint
    // for individual items returns 404. Details are only shown when clicking
    // on items from search results which provides the data directly.
  }, [
    searchTerm,
    dispatch,
    fetchSeasons,
    searchParams,
    params.page,
    params.detailsId,
  ]);

  // Handle closing details when details panel is closed via Redux
  useEffect(() => {
    if (
      !isDetailsOpen &&
      (params.detailsId || getDetailsFromUrl(searchParams))
    ) {
      handleCloseDetails();
    }
  }, [isDetailsOpen, params.detailsId, searchParams, handleCloseDetails]);

  // Get paginated results for display
  const { paginatedItems: paginatedSeasons } = getPaginatedItems(
    seasons,
    pagination.currentPage,
    pagination.itemsPerPage
  );

  return (
    <AppContainer
      seasons={paginatedSeasons}
      query={query}
      onInputChange={handleInputChange}
      onSearch={handleSearch}
      results={paginatedSeasons}
      loading={loading}
      selectedItems={selectedSeasons}
      pagination={pagination}
      onPageChange={handlePageChange}
      onItemClick={handleItemClick}
      isDetailsOpen={isDetailsOpen}
    />
  );
};

export default App;
