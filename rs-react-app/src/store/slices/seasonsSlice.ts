import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Season } from '../../interfaces/interface';

export interface SeasonsState {
  seasons: Season[];
  loading: boolean;
  error: string | null;
  query: string;
}

const initialState: SeasonsState = {
  seasons: [],
  loading: false,
  error: null,
  query: '',
};

// Async thunk for fetching seasons
export const fetchSeasonsAsync = createAsyncThunk(
  'seasons/fetchSeasons',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://stapi.co/api/v1/rest/season/search?title=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.seasons || [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasonsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeasonsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.seasons = action.payload;
        state.error = null;
      })
      .addCase(fetchSeasonsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, clearSeasons, setError } = seasonsSlice.actions;
export default seasonsSlice.reducer;