import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Season, SeasonsState } from '../../interfaces/interface';

const initialState: SeasonsState = {
  seasons: [],
  loading: false,
  error: null,
  query: '',
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 5, // Show 5 items per page
  },
};

// Async thunk for fetching seasons
export const fetchSeasonsAsync = createAsyncThunk(
  'seasons/fetchSeasons',
  async (
    { query, page = 1 }: { query: string; page?: number },
    { rejectWithValue }
  ) => {
    try {
      // Always make API calls - let tests mock the fetch response
      const response = await fetch(
        'https://stapi.co/api/v1/rest/season/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `title=${encodeURIComponent(query)}`,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        seasons: data.seasons || [],
        currentPage: page,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An error occurred'
      );
    }
  }
);

const seasonsSlice = createSlice({
  name: 'seasons',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSeasons: (state) => {
      state.seasons = [];
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSeasons: (
      state,
      action: PayloadAction<{
        seasons: Season[];
        error?: string | null;
        currentPage?: number;
      }>
    ) => {
      state.seasons = action.payload.seasons;
      state.loading = false;
      state.error = action.payload.error || null;

      // Update pagination info
      const currentPage = action.payload.currentPage || 1;
      const totalItems = action.payload.seasons.length;
      const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage);

      state.pagination = {
        ...state.pagination,
        currentPage,
        totalPages,
        totalItems,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setSeasonsData: (
      state,
      action: PayloadAction<{
        seasons: Season[];
        currentPage: number;
      }>
    ) => {
      state.seasons = action.payload.seasons;
      state.loading = false;
      state.error = null;

      // Update pagination info
      const currentPage = action.payload.currentPage;
      const totalItems = action.payload.seasons.length;
      const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage);

      state.pagination = {
        ...state.pagination,
        currentPage,
        totalPages,
        totalItems,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasonsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeasonsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.seasons = action.payload.seasons;
        state.error = null;

        // Update pagination info for API results
        const currentPage = action.payload.currentPage || 1;
        const totalItems = action.payload.seasons.length;
        const totalPages = Math.ceil(
          totalItems / state.pagination.itemsPerPage
        );

        state.pagination = {
          ...state.pagination,
          currentPage,
          totalPages,
          totalItems,
        };
      })
      .addCase(fetchSeasonsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});



export const {
  setQuery,
  clearSeasons,
  setError,
  setSeasons,
  setLoading,
  setCurrentPage,
  setSeasonsData,
} = seasonsSlice.actions;
export default seasonsSlice.reducer;
