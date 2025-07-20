import { SeasonService, createSeasonService, handleInputChange, fetchSeasons, handleSearch, load, handleError } from '../services/services';
import { LocalStorageService } from '../services/LocalStorageService';
import type { AppState } from '../interfaces/interface';

// Mock LocalStorageService
jest.mock('../services/LocalStorageService', () => ({
  LocalStorageService: {
    saveSearchTerm: jest.fn(),
  },
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to suppress error logs during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
  // Set the actual API URL for tests
  import.meta.env.VITE_URL = 'https://stapi.co/api/v1/rest/season/search';
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('SeasonService', () => {
  let mockComponent: React.Component<Record<string, never>, AppState>;
  let service: SeasonService;

  beforeEach(() => {
    // Create mock component with setState and mutable state
    const mockState = {
      query: '',
      results: [],
      loading: false,
      error: null,
    };

    mockComponent = {
      setState: jest.fn(),
      state: mockState,
    } as any;

    service = new SeasonService(mockComponent);
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    test('initializes with API URL from environment', () => {
      const newService = new SeasonService(mockComponent);
      expect(newService.getApiUrl()).toBe('https://stapi.co/api/v1/rest/season/search');
    });

    test('initializes with VITE_URL when set', () => {
      const originalEnv = import.meta.env.VITE_URL;
      import.meta.env.VITE_URL = 'https://api.example.com';

      const newService = new SeasonService(mockComponent);
      expect(newService.getApiUrl()).toBe('https://api.example.com');

      import.meta.env.VITE_URL = originalEnv;
    });

    test('stores component reference', () => {
      expect(service['component']).toBe(mockComponent);
    });
  });

  describe('handleInputChange', () => {
    test('updates component state with input value', () => {
      const mockEvent = {
        target: { value: 'test search' }
      } as React.ChangeEvent<HTMLInputElement>;

      service.handleInputChange(mockEvent);

      expect(mockComponent.setState).toHaveBeenCalledWith({ query: 'test search' });
    });

    test('handles empty input value', () => {
      const mockEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;

      service.handleInputChange(mockEvent);

      expect(mockComponent.setState).toHaveBeenCalledWith({ query: '' });
    });

    test('handles special characters in input', () => {
      const mockEvent = {
        target: { value: 'test@#$%^&*()' }
      } as React.ChangeEvent<HTMLInputElement>;

      service.handleInputChange(mockEvent);

      expect(mockComponent.setState).toHaveBeenCalledWith({ query: 'test@#$%^&*()' });
    });
  });

  describe('fetchSeasons', () => {
    test('successfully fetches and processes seasons data', async () => {
      const mockData = {
        seasons: [
          { uid: '1', title: 'Season 1', numberOfEpisodes: 10 },
          { uid: '2', title: 'Season 2', numberOfEpisodes: 12 }
        ],
        page: { pageNumber: 1, pageSize: 10, numberOfElements: 2, totalElements: 2, totalPages: 1 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await service.fetchSeasons('test query');

      expect(mockComponent.setState).toHaveBeenCalledWith({ loading: true, error: null, results: [] });
      expect(mockFetch).toHaveBeenCalledWith('https://stapi.co/api/v1/rest/season/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'title=test%20query',
      });
      expect(mockComponent.setState).toHaveBeenCalledWith({ results: mockData.seasons, loading: false });
    });

    test('handles empty query by sending empty title', async () => {
      const mockData = { seasons: [], page: { pageNumber: 1, pageSize: 10, numberOfElements: 0, totalElements: 0, totalPages: 0 } };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await service.fetchSeasons('   ');

      expect(mockFetch).toHaveBeenCalledWith('https://stapi.co/api/v1/rest/season/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'title=',
      });
    });

    test('handles API response error (non-200 status)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await service.fetchSeasons('test query');

      expect(mockComponent.setState).toHaveBeenCalledWith({ loading: true, error: null, results: [] });
      expect(mockComponent.setState).toHaveBeenCalledWith({
        error: 'Failed to fetch data.',
        loading: false,
      });
    });

    test('handles network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await service.fetchSeasons('test query');

      expect(mockComponent.setState).toHaveBeenCalledWith({ loading: true, error: null, results: [] });
      expect(mockComponent.setState).toHaveBeenCalledWith({
        error: 'Failed to fetch data.',
        loading: false,
      });
    });

    test('handles malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await service.fetchSeasons('test query');

      expect(mockComponent.setState).toHaveBeenCalledWith({
        error: 'Failed to fetch data.',
        loading: false,
      });
    });

    test('encodes special characters in query', async () => {
      const mockData = { seasons: [], page: { pageNumber: 1, pageSize: 10, numberOfElements: 0, totalElements: 0, totalPages: 0 } };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await service.fetchSeasons('test@#$%^&*()');

      expect(mockFetch).toHaveBeenCalledWith('https://stapi.co/api/v1/rest/season/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'title=test%40%23%24%25%5E%26*()',
      });
    });
  });

  describe('handleSearch', () => {
    test('saves search term and fetches seasons', async () => {
      (mockComponent.state as any).query = 'test search';
      const fetchSpy = jest.spyOn(service, 'fetchSeasons').mockResolvedValue();

      service.handleSearch();

      expect(LocalStorageService.saveSearchTerm).toHaveBeenCalledWith('test search');
      expect(fetchSpy).toHaveBeenCalledWith('test search');

      fetchSpy.mockRestore();
    });

    test('trims whitespace from search term', async () => {
      (mockComponent.state as any).query = '  test search  ';
      const fetchSpy = jest.spyOn(service, 'fetchSeasons').mockResolvedValue();

      service.handleSearch();

      expect(LocalStorageService.saveSearchTerm).toHaveBeenCalledWith('test search');
      expect(fetchSpy).toHaveBeenCalledWith('test search');

      fetchSpy.mockRestore();
    });

    test('handles empty search term', async () => {
      (mockComponent.state as any).query = '';
      const fetchSpy = jest.spyOn(service, 'fetchSeasons').mockResolvedValue();

      service.handleSearch();

      expect(LocalStorageService.saveSearchTerm).toHaveBeenCalledWith('');
      expect(fetchSpy).toHaveBeenCalledWith('');

      fetchSpy.mockRestore();
    });
  });

  describe('load', () => {
    test('fetches seasons with current query', async () => {
      (mockComponent.state as any).query = 'initial query';
      const fetchSpy = jest.spyOn(service, 'fetchSeasons').mockResolvedValue();

      service.load();

      expect(fetchSpy).toHaveBeenCalledWith('initial query');

      fetchSpy.mockRestore();
    });

    test('trims whitespace from query before fetching', async () => {
      (mockComponent.state as any).query = '  initial query  ';
      const fetchSpy = jest.spyOn(service, 'fetchSeasons').mockResolvedValue();

      service.load();

      expect(fetchSpy).toHaveBeenCalledWith('initial query');

      fetchSpy.mockRestore();
    });
  });

  describe('handleError', () => {
    test('sets error state in component', () => {
      service.handleError();

      expect(mockComponent.setState).toHaveBeenCalledWith({ error: 'An error occurred!' });
    });
  });

  describe('getApiUrl', () => {
    test('returns current API URL', () => {
      expect(service.getApiUrl()).toBe('https://stapi.co/api/v1/rest/season/search');
    });
  });

  describe('setApiUrl', () => {
    test('updates API URL', () => {
      service.setApiUrl('https://new-api.example.com');
      expect(service.getApiUrl()).toBe('https://new-api.example.com');
    });

    test('allows setting empty URL', () => {
      service.setApiUrl('');
      expect(service.getApiUrl()).toBe('');
    });
  });
});

describe('Factory and Legacy Functions', () => {
  let mockComponent: React.Component<Record<string, never>, AppState>;

  beforeEach(() => {
    const mockState = {
      query: 'test query',
      results: [],
      loading: false,
      error: null,
    };

    mockComponent = {
      setState: jest.fn(),
      state: mockState,
    } as any;

    jest.clearAllMocks();
  });

  describe('createSeasonService', () => {
    test('creates and returns SeasonService instance', () => {
      const service = createSeasonService(mockComponent);
      
      expect(service).toBeInstanceOf(SeasonService);
      expect(service['component']).toBe(mockComponent);
    });
  });

  describe('handleInputChange (legacy)', () => {
    test('creates service and handles input change', () => {
      const mockEvent = {
        target: { value: 'legacy test' }
      } as React.ChangeEvent<HTMLInputElement>;

      const handler = handleInputChange(mockComponent);
      handler(mockEvent);

      expect(mockComponent.setState).toHaveBeenCalledWith({ query: 'legacy test' });
    });
  });

  describe('fetchSeasons (legacy)', () => {
    test('creates service and fetches seasons successfully', async () => {
      const mockData = {
        seasons: [{ uid: '1', title: 'Legacy Season 1' }],
        page: { pageNumber: 1, pageSize: 10, numberOfElements: 1, totalElements: 1, totalPages: 1 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await fetchSeasons(mockComponent, 'legacy query');

      expect(mockComponent.setState).toHaveBeenCalledWith({ loading: true, error: null, results: [] });
      expect(mockFetch).toHaveBeenCalledWith('https://stapi.co/api/v1/rest/season/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'title=legacy%20query',
      });
      expect(mockComponent.setState).toHaveBeenCalledWith({ results: mockData.seasons, loading: false });
    });

    test('handles fetch error in legacy function', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Legacy fetch error'));

      await fetchSeasons(mockComponent, 'legacy query');

      expect(mockComponent.setState).toHaveBeenCalledWith({
        error: 'Failed to fetch data.',
        loading: false,
      });
    });
  });

  describe('handleSearch (legacy)', () => {
    test('saves term and fetches seasons', async () => {
      const mockData = { seasons: [], page: { pageNumber: 1, pageSize: 10, numberOfElements: 0, totalElements: 0, totalPages: 0 } };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const handler = handleSearch(mockComponent);
      await handler();

      expect(LocalStorageService.saveSearchTerm).toHaveBeenCalledWith('test query');
      expect(mockFetch).toHaveBeenCalledWith('https://stapi.co/api/v1/rest/season/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'title=test%20query',
      });
    });

    test('handles whitespace trimming in legacy handleSearch', async () => {
      (mockComponent.state as any).query = '  whitespace test  ';
      const mockData = { seasons: [], page: { pageNumber: 1, pageSize: 10, numberOfElements: 0, totalElements: 0, totalPages: 0 } };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const handler = handleSearch(mockComponent);
      await handler();

      expect(LocalStorageService.saveSearchTerm).toHaveBeenCalledWith('whitespace test');
      expect(mockFetch).toHaveBeenCalledWith('https://stapi.co/api/v1/rest/season/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'title=whitespace%20test',
      });
    });
  });

  describe('load (legacy)', () => {
    test('creates service and loads with current query', async () => {
      const mockData = { seasons: [], page: { pageNumber: 1, pageSize: 10, numberOfElements: 0, totalElements: 0, totalPages: 0 } };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      load(mockComponent);

      expect(mockFetch).toHaveBeenCalledWith('https://stapi.co/api/v1/rest/season/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'title=test%20query',
      });
    });
  });

  describe('handleError (legacy)', () => {
    test('creates service and handles error', () => {
      const handler = handleError(mockComponent);
      handler();

      expect(mockComponent.setState).toHaveBeenCalledWith({ error: 'An error occurred!' });
    });
  });
});

describe('Integration Tests', () => {
  let mockComponent: React.Component<Record<string, never>, AppState>;
  let service: SeasonService;

  beforeEach(() => {
    const mockState = {
      query: '',
      results: [],
      loading: false,
      error: null,
    };

    mockComponent = {
      setState: jest.fn(),
      state: mockState,
    } as any;

    service = new SeasonService(mockComponent);
    jest.clearAllMocks();
  });

  test('complete workflow: input change -> search -> fetch -> results', async () => {
    const mockData = {
      seasons: [{ uid: '1', title: 'Integration Test Season' }],
      page: { pageNumber: 1, pageSize: 10, numberOfElements: 1, totalElements: 1, totalPages: 1 }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    // Step 1: Handle input change
    const mockEvent = {
      target: { value: 'integration test' }
    } as React.ChangeEvent<HTMLInputElement>;

    service.handleInputChange(mockEvent);
    (mockComponent.state as any).query = 'integration test';

    // Step 2: Handle search
    service.handleSearch();

    // Verify localStorage was called
    expect(LocalStorageService.saveSearchTerm).toHaveBeenCalledWith('integration test');

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    // Verify API call was made
    expect(mockFetch).toHaveBeenCalledWith('https://stapi.co/api/v1/rest/season/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'title=integration%20test',
    });
  });

  test('error recovery: API error -> error state -> successful retry', async () => {
    // First call fails
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await service.fetchSeasons('test');

    expect(mockComponent.setState).toHaveBeenCalledWith({
      error: 'Failed to fetch data.',
      loading: false,
    });

    // Reset mock and try again successfully
    jest.clearAllMocks();
    const mockData = { seasons: [{ uid: '1', title: 'Success' }], page: { pageNumber: 1, pageSize: 10, numberOfElements: 1, totalElements: 1, totalPages: 1 } };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await service.fetchSeasons('test');

    expect(mockComponent.setState).toHaveBeenCalledWith({ results: mockData.seasons, loading: false });
  });
}); 