import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Season, SeasonDetail } from '../../interfaces/interface';

// Define the base query with error handling
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://stapi.co/api/v1/rest/',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return headers;
  },
  // Use global fetch for test environments, browser fetch otherwise
  fetchFn:
    typeof global !== 'undefined' && global.fetch
      ? global.fetch
      : typeof window !== 'undefined'
        ? window.fetch
        : undefined,
});

// Enhanced base query with error handling and retry logic
const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    typeof result.error.status === 'number' &&
    result.error.status >= 500
  ) {
    // Retry once for server errors
    await new Promise((resolve) => setTimeout(resolve, 500));
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

// Define API slice with endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Season', 'SeasonDetail', 'SearchResults'],
  endpoints: (builder) => ({
    // Search seasons endpoint
    searchSeasons: builder.query<
      { seasons: Season[]; currentPage: number },
      { query: string; page?: number }
    >({
      query: ({ query }) => ({
        url: 'season/search',
        method: 'POST',
        body: `title=${encodeURIComponent(query)}`,
      }),
      transformResponse: (response: any, _meta, arg) => ({
        seasons: response.seasons || [],
        currentPage: arg.page || 1,
      }),
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: response.data?.message || 'Search failed',
      }),
      providesTags: (result, _error, arg) => [
        { type: 'SearchResults', id: `${arg.query}-${arg.page}` },
        ...(result?.seasons?.map((season) => ({
          type: 'Season' as const,
          id: season.uid,
        })) || []),
      ],
      // Keep cache for 5 minutes
      keepUnusedDataFor: 300,
      // Custom cache key function for better cache management
      serializeQueryArgs: ({ queryArgs }) => {
        const { query, page = 1 } = queryArgs;
        return `${query.toLowerCase().trim()}-${page}`;
      },
    }),

    // Get season details endpoint
    getSeasonDetails: builder.query<SeasonDetail, string>({
      query: (seasonId) => `season/${seasonId}`,
      transformResponse: (response: any) => {
        // Handle both direct season data and wrapped responses
        return response.season || response;
      },
      transformErrorResponse: (response: any) => ({
        status: response.status,
        message: response.data?.message || 'Failed to fetch season details',
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'SeasonDetail', id: arg },
        { type: 'Season', id: arg },
      ],
      // Keep cache for 10 minutes for detail pages
      keepUnusedDataFor: 600,
    }),

    // Mutation for cache invalidation (useful for future features)
    refreshSearchCache: builder.mutation<
      void,
      { query: string; page?: number }
    >({
      queryFn: async () => ({ data: undefined }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'SearchResults', id: `${arg.query}-${arg.page || 1}` },
      ],
    }),

    // Mutation for refreshing season details cache
    refreshSeasonDetails: builder.mutation<void, string>({
      queryFn: async () => ({ data: undefined }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'SeasonDetail', id: arg },
        { type: 'Season', id: arg },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSearchSeasonsQuery,
  useGetSeasonDetailsQuery,
  useLazySearchSeasonsQuery,
  useLazyGetSeasonDetailsQuery,
  useRefreshSearchCacheMutation,
  useRefreshSeasonDetailsMutation,
} = apiSlice;

// Cache invalidation utilities
export const invalidateSearchResults = () =>
  apiSlice.util.invalidateTags(['SearchResults']);

export const invalidateSeasonDetails = (seasonId?: string) =>
  seasonId
    ? apiSlice.util.invalidateTags([{ type: 'SeasonDetail', id: seasonId }])
    : apiSlice.util.invalidateTags(['SeasonDetail']);

export const invalidateAllSeasons = () =>
  apiSlice.util.invalidateTags(['Season']);

// Optimistic update utilities
export const updateSeasonInCache = (
  seasonId: string,
  updates: Partial<Season>
) =>
  apiSlice.util.updateQueryData('getSeasonDetails', seasonId, (draft) => {
    Object.assign(draft, updates);
  });

// Prefetch utilities for better UX
export const prefetchSeasonDetails = (seasonId: string) =>
  apiSlice.util.prefetch('getSeasonDetails', seasonId, { force: false });

// Export additional utilities
export const {
  util: { updateQueryData, upsertQueryData, invalidateTags, resetApiState },
  internalActions,
} = apiSlice;

// Advanced cache management hooks
export const useCacheInvalidation = () => {
  return {
    invalidateSearchResults,
    invalidateSeasonDetails,
    invalidateAllSeasons,
    updateSeasonInCache,
    prefetchSeasonDetails,
  };
};
