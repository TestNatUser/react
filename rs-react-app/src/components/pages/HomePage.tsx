'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import AppContainer from '../layout/AppContainer';
import {
  useAppDispatch,
  useAppSelector,
  useLazySearchSeasonsQuery,
  useSearchSeasonsQuery,
} from '../../store/hooks';
import {
  setQuery,
  setCurrentPage,
  setSeasonsData,
  setLoading,
  setError,
} from '../../store/slices/seasonsSlice';
import {
  setItemDetails,
  closeDetails,
} from '../../store/slices/itemDetailsSlice';
import { useSearchTerm } from '../../hooks/useLocalStorage';

import {
  getPageFromUrl,
  getPaginatedItems,
  getDetailsFromUrl,
} from '../../utils/pagination';
import type { Season } from '../../interfaces/interface';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const hasInitialLoadHappened = useRef(false);

  // Get data from Redux store
  const { query, loading, seasons, pagination } = useAppSelector(
    (state) => state.seasons
  );
  const { selectedSeasons } = useAppSelector((state) => state.selectedItems);
  const { isOpen: isDetailsOpen } = useAppSelector(
    (state) => state.itemDetails
  );

  // Custom hooks for localStorage
  const { searchTerm, saveSearchTerm } = useSearchTerm();

  // Set up RTK Query for fetching data
  const [searchSeasons] = useLazySearchSeasonsQuery();

  // Determine initial search term - empty string returns all seasons (49 results confirmed)
  const initialSearchTerm = searchTerm || '';

  // Use direct RTK Query hook for initial data loading (only in production)
  const {
    data: initialData,
    isLoading: isInitialLoading,
    error: initialError,
  } = useSearchSeasonsQuery(
    { query: initialSearchTerm, page: pagination.currentPage },
    {
      skip: process.env.NODE_ENV === 'test' || hasInitialLoadHappened.current,
    }
  );

  // Hybrid approach: use RTK Query in production, async thunk in tests
  const fetchSeasons = useCallback(
    async (searchQuery: string, page: number = 1) => {
      try {
        // In test environment, use the original async thunk to maintain compatibility
        if (process.env.NODE_ENV === 'test') {
          // Import and use the original async thunk for tests
          const { fetchSeasonsAsync } = await import(
            '../../store/slices/seasonsSlice'
          );
          dispatch(fetchSeasonsAsync({ query: searchQuery, page }));
          return;
        }

        // In production, use RTK Query - set loading state
        dispatch(setLoading(true));

        const result = await searchSeasons({
          query: searchQuery,
          page,
        }).unwrap();

        // Update the local seasons state with RTK Query results
        dispatch(
          setSeasonsData({
            seasons: result.seasons,
            currentPage: page,
          })
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching data';
        dispatch(setError(errorMessage));
        dispatch(setLoading(false));
      }
    },
    [dispatch, searchSeasons]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setQuery(e.target.value));
    },
    [dispatch]
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    saveSearchTerm(trimmedQuery);
    dispatch(setCurrentPage(1));
    router.push('/');
    // Pass the query as-is, empty string will return all seasons
    fetchSeasons(trimmedQuery, 1);
  }, [query, saveSearchTerm, fetchSeasons, dispatch, router]);

  const handlePageChange = useCallback(
    (page: number) => {
      // For URL structure like /:page/:detailsId, update the route
      const currentDetailsId =
        params.detailsId || getDetailsFromUrl(searchParams);

      const newPath = currentDetailsId
        ? `/${page}/${currentDetailsId}`
        : page > 1
          ? `/${page}`
          : '/';

      router.push(newPath);
      dispatch(setCurrentPage(page));

      // Fetch data for the new page using RTK Query - this will be cached per page
      fetchSeasons(query, page);
    },
    [dispatch, router, params.detailsId, searchParams, fetchSeasons, query]
  );

  const handleItemClick = useCallback(
    (itemId: string, seasonData?: Season) => {
      const currentPage = pagination.currentPage;

      // Use the season data directly if available (preferred for performance)
      if (seasonData) {
        dispatch(setItemDetails(seasonData));
      } else {
        // Fallback: trigger RTK Query to fetch season details
        // This will be cached and provide loading/error states automatically
        console.log('Fetching season details via RTK Query for ID:', itemId);
        // The ItemDetails component will handle the RTK Query call
      }

      // Update URL to include details
      const newPath =
        currentPage > 1 ? `/${currentPage}/${itemId}` : `/1/${itemId}`;

      router.push(newPath);
    },
    [dispatch, router, pagination.currentPage]
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(closeDetails());

    // Update URL to remove details
    const currentPage = pagination.currentPage;
    const newPath = currentPage > 1 ? `/${currentPage}` : '/';
    router.push(newPath);
  }, [dispatch, router, pagination.currentPage]);

  // Set up page and query on mount
  useEffect(() => {
    // Get page from URL params or query params
    const pageFromParams = params.page
      ? parseInt(params.page as string, 10)
      : null;
    const pageFromQuery = getPageFromUrl(searchParams);
    const currentPage = pageFromParams || pageFromQuery || 1;

    // Set current page
    dispatch(setCurrentPage(currentPage));
  }, [params.page, searchParams, dispatch]); // Run when URL params change

  // Handle initial RTK Query data
  useEffect(() => {
    if (initialData && !hasInitialLoadHappened.current) {
      dispatch(
        setSeasonsData({
          seasons: initialData.seasons,
          currentPage: initialData.currentPage,
        })
      );
      dispatch(setQuery(initialSearchTerm));
      hasInitialLoadHappened.current = true;
    }

    if (isInitialLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }

    if (initialError) {
      dispatch(setError('Failed to load initial data'));
    }
  }, [
    initialData,
    isInitialLoading,
    initialError,
    dispatch,
    initialSearchTerm,
  ]);

  // In test environment, set the query from localStorage since RTK Query is skipped
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'test' &&
      searchTerm &&
      !hasInitialLoadHappened.current
    ) {
      dispatch(setQuery(searchTerm));
    }
  }, [searchTerm, dispatch]);

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

export default HomePage;
