import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  SeasonDetail,
  ItemDetailsState,
} from '../../interfaces/interface';

const initialState: ItemDetailsState = {
  selectedItem: null,
  loading: false,
  error: null,
  isOpen: false,
};

// Async thunk for fetching item details
export const fetchItemDetailsAsync = createAsyncThunk(
  'itemDetails/fetchDetails',
  async (itemId: string, { rejectWithValue }) => {
    try {
      // For mock data, return detailed version of the item
      if (itemId.startsWith('mock-')) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Create mock detailed data
        const mockDetail: SeasonDetail = {
          uid: itemId,
          title: `Star Trek Season Details - ${itemId}`,
          numberOfEpisodes: Math.floor(Math.random() * 26) + 10,
          originalRunStartDate: '2023-01-01',
          originalRunEndDate: '2023-12-31',
          series: {
            uid: 'series-' + itemId,
            title: 'Star Trek Series',
          },
          episodes: Array.from({ length: 5 }, (_, i) => ({
            uid: `episode-${itemId}-${i + 1}`,
            title: `Episode ${i + 1}`,
            seasonNumber: 1,
            episodeNumber: i + 1,
          })),
          productionCompany: {
            uid: 'paramount',
            name: 'Paramount Pictures',
          },
          originalBroadcaster: {
            uid: 'cbs',
            name: 'CBS',
          },
        };

        return mockDetail;
      }

      // For real API calls
      const response = await fetch(
        `https://stapi.co/api/v1/rest/season/${itemId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.season;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch item details'
      );
    }
  }
);

const itemDetailsSlice = createSlice({
  name: 'itemDetails',
  initialState,
  reducers: {
    openDetails: (state) => {
      state.isOpen = true;
      state.error = null;
    },
    closeDetails: (state) => {
      state.isOpen = false;
      state.selectedItem = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
        state.error = null;
        state.isOpen = true;
      })
      .addCase(fetchItemDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isOpen = true; // Keep open to show error
      });
  },
});

export const { openDetails, closeDetails, clearError } =
  itemDetailsSlice.actions;
export default itemDetailsSlice.reducer;
