import itemDetailsReducer, {
  openDetails,
  closeDetails,
  clearError,
  fetchItemDetailsAsync,
  type ItemDetailsState,
} from '../store/slices/itemDetailsSlice';
import { configureStore } from '@reduxjs/toolkit';
import type { SeasonDetail } from '../interfaces/interface';

const mockSeasonDetail: SeasonDetail = {
  uid: 'season-1',
  title: 'Star Trek Season 1',
  numberOfEpisodes: 26,
  originalRunStartDate: '2023-01-01',
  originalRunEndDate: '2023-12-31',
  series: {
    uid: 'series-1',
    title: 'Star Trek',
  },
  episodes: [
    {
      uid: 'episode-1',
      title: 'The Cage',
      seasonNumber: 1,
      episodeNumber: 1,
    },
  ],
  productionCompany: {
    uid: 'paramount',
    name: 'Paramount Pictures',
  },
  originalBroadcaster: {
    uid: 'cbs',
    name: 'CBS',
  },
};

// Mock fetch for testing
global.fetch = jest.fn();

describe('itemDetailsSlice', () => {
  const initialState: ItemDetailsState = {
    selectedItem: null,
    loading: false,
    error: null,
    isOpen: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    expect(itemDetailsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('openDetails should set isOpen to true and clear error', () => {
    const stateWithError = {
      ...initialState,
      error: 'Previous error',
    };

    const action = openDetails('season-1');
    const state = itemDetailsReducer(stateWithError, action);

    expect(state.isOpen).toBe(true);
    expect(state.error).toBeNull();
  });

  test('closeDetails should reset state', () => {
    const stateWithDetails = {
      ...initialState,
      isOpen: true,
      selectedItem: mockSeasonDetail,
      error: 'Some error',
    };

    const action = closeDetails();
    const state = itemDetailsReducer(stateWithDetails, action);

    expect(state.isOpen).toBe(false);
    expect(state.selectedItem).toBeNull();
    expect(state.error).toBeNull();
  });

  test('clearError should only clear error', () => {
    const stateWithError = {
      ...initialState,
      isOpen: true,
      selectedItem: mockSeasonDetail,
      error: 'Some error',
    };

    const action = clearError();
    const state = itemDetailsReducer(stateWithError, action);

    expect(state.error).toBeNull();
    expect(state.isOpen).toBe(true);
    expect(state.selectedItem).toEqual(mockSeasonDetail);
  });

  describe('fetchItemDetailsAsync', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          itemDetails: itemDetailsReducer,
        },
      });
    });

    test('should handle pending state', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      store.dispatch(fetchItemDetailsAsync('season-1'));

      const state = store.getState().itemDetails;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle fulfilled state with mock data', async () => {
      // const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>; // Removed unused

      // Mock the async thunk to resolve with mock data for mock IDs
      const thunk = fetchItemDetailsAsync('mock-season-1');
      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('itemDetails/fetchDetails/fulfilled');
      expect(result.payload).toMatchObject({
        uid: 'mock-season-1',
        title: expect.stringContaining('Star Trek Season Details'),
      });
    });

    test('should handle fulfilled state with real API data', async () => {
      const mockApiResponse = {
        season: mockSeasonDetail,
      };

      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      await store.dispatch(fetchItemDetailsAsync('season-1'));

      const state = store.getState().itemDetails;
      expect(state.loading).toBe(false);
      expect(state.selectedItem).toEqual(mockSeasonDetail);
      expect(state.error).toBeNull();
      expect(state.isOpen).toBe(true);
    });

    test('should handle rejected state with API error', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await store.dispatch(fetchItemDetailsAsync('season-1'));

      const state = store.getState().itemDetails;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(
        'Season details not found. The individual season details endpoint may not be available in the Star Trek API.'
      );
      expect(state.isOpen).toBe(true);
    });

    test('should handle rejected state with network error', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await store.dispatch(fetchItemDetailsAsync('season-1'));

      const state = store.getState().itemDetails;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.isOpen).toBe(true);
    });

    test('should handle rejected state with unknown error', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValueOnce('Unknown error');

      await store.dispatch(fetchItemDetailsAsync('season-1'));

      const state = store.getState().itemDetails;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch item details');
      expect(state.isOpen).toBe(true);
    });

    test('should create mock data with correct structure for mock IDs', async () => {
      const thunk = fetchItemDetailsAsync('mock-test-season');
      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await thunk(dispatch, getState, undefined);
      const mockDetail = result.payload as SeasonDetail;

      expect(mockDetail.uid).toBe('mock-test-season');
      expect(mockDetail.title).toContain('Star Trek Season Details');
      expect(mockDetail.numberOfEpisodes).toBeGreaterThanOrEqual(10);
      expect(mockDetail.series).toBeDefined();
      expect(mockDetail.episodes).toBeDefined();
      expect(mockDetail.productionCompany).toBeDefined();
      expect(mockDetail.originalBroadcaster).toBeDefined();
    });
  });
});
