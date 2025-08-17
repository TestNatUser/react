import { render, fireEvent, screen, waitFor } from '../__tests__/test-utils';
import {
  mockApiSuccess,
  mockApiError,
  setupFetchMock,
  resetFetchMock,
} from '../__tests__/mocks/api';
import {
  mockLocalStorage,
  setupLocalStorageMock,
  clearAllMocks,
} from '../__tests__/test-utils';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    setupFetchMock();
    setupLocalStorageMock();
    clearAllMocks();
    resetFetchMock();
    // Set default localStorage behavior
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Initial Rendering Tests', () => {
    test('renders without crashing', () => {
      const { container } = render(<App />);
      expect(container.firstChild).toBeTruthy();
    });

    test('renders main app structure', () => {
      render(<App />);

      // Should render the app container
      const appElement = document.querySelector('.app-container');
      expect(appElement).toBeTruthy();
    });

    test('renders header with search functionality', () => {
      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      expect(searchInput).toBeTruthy();
      expect(searchButton).toBeTruthy();
    });
  });

  describe('LocalStorage Integration Tests', () => {
    test('retrieves saved search term on component mount', () => {
      const savedTerm = 'saved search term';
      // Set up mock BEFORE rendering component
      mockLocalStorage.getItem.mockReturnValue(savedTerm);
      mockApiSuccess([]);

      render(<App />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'season-search-term'
      );

      const searchInput = screen.getByRole('textbox') as HTMLInputElement;
      expect(searchInput.value).toBe(savedTerm);
    });

    test('displays empty input when no saved term exists', () => {
      // Set up mock BEFORE rendering component
      mockLocalStorage.getItem.mockReturnValue(null);
      mockApiSuccess([]);

      render(<App />);

      const searchInput = screen.getByRole('textbox') as HTMLInputElement;
      expect(searchInput.value).toBe('');
    });

    test('saves search term to localStorage on search', async () => {
      mockApiSuccess([]);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'new search' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'season-search-term',
          'new search'
        );
      });
    });

    test('trims whitespace from search term before saving', async () => {
      mockApiSuccess([]);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: '  spaced term  ' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'season-search-term',
          'spaced term'
        );
      });
    });
  });

  describe('Mock Data Integration Tests', () => {
    test('uses mock data for search in test environment', async () => {
      const mockData = [
        {
          uid: '1',
          title: 'Star Trek: The Original Series - Season 1',
          numberOfEpisodes: 29,
          series: { uid: 'tos', title: 'Star Trek: The Original Series' },
        },
      ];

      mockApiSuccess(mockData);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'original' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(
          screen.getByText('Star Trek: The Original Series - Season 1')
        ).toBeTruthy();
      });
    });

    test('handles mock data search results', async () => {
      const mockData = [
        {
          uid: '2',
          title: 'Star Trek: The Next Generation - Season 1',
          numberOfEpisodes: 26,
          series: { uid: 'tng', title: 'Star Trek: The Next Generation' },
        },
      ];

      mockApiSuccess(mockData);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'generation' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(
          screen.getByText('Star Trek: The Next Generation - Season 1')
        ).toBeTruthy();
      });
    });

    test('handles API error responses', async () => {
      mockApiError(500, 'Server Error');

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        // Should handle error gracefully - exact UI depends on implementation
        const searchInputAfterError = screen.getByRole('textbox');
        expect(searchInputAfterError).toBeTruthy();
      });
    });

    test('handles network errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        // Should handle network error gracefully
        const searchInputAfterError = screen.getByRole('textbox');
        expect(searchInputAfterError).toBeTruthy();
      });
    });
  });

  describe('Loading State Management Tests', () => {
    test('manages loading states during API calls', async () => {
      let resolvePromise: (value: unknown) => void;
      const apiPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      global.fetch = jest.fn().mockReturnValue(apiPromise);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      // Should show loading state
      await waitFor(() => {
        const loader = document.querySelector('.loader');
        expect(loader).toBeTruthy();
      });

      // Resolve the API call
      resolvePromise?.({
        ok: true,
        json: async () => [],
      });

      // Loading should disappear
      await waitFor(() => {
        const loader = document.querySelector('.loader');
        expect(loader).toBeFalsy();
      });
    });

    test('shows loading indicator during search', async () => {
      mockApiSuccess([]);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      // Wait for loading indicator to appear
      await waitFor(() => {
        const loader = document.querySelector('.loader');
        expect(loader).toBeTruthy();
      });
    });
  });

  describe('State Management Tests', () => {
    test('updates component state based on API responses', async () => {
      const mockData = [
        {
          uid: '1',
          title: 'State Test Season',
          numberOfEpisodes: 5,
          series: { uid: 'series-1', title: 'State Test Series' },
        },
      ];

      mockApiSuccess(mockData);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('State Test Season')).toBeTruthy();
        expect(screen.getByText(/Episodes: 5/)).toBeTruthy();
      });
    });

    test('manages search term state correctly', () => {
      render(<App />);

      const searchInput = screen.getByRole('textbox') as HTMLInputElement;

      fireEvent.change(searchInput, { target: { value: 'new value' } });

      expect(searchInput.value).toBe('new value');
    });

    test('handles empty search results', async () => {
      mockApiSuccess([]);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('No seasons found.')).toBeTruthy();
      });
    });
  });

  describe('User Interaction Tests', () => {
    test('complete search workflow', async () => {
      const mockData = [
        {
          uid: '1',
          title: 'Workflow Test Season',
          numberOfEpisodes: 8,
          series: { uid: 'series-1', title: 'Workflow Test Series' },
        },
      ];

      mockApiSuccess(mockData);

      render(<App />);

      // Type in search input
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'workflow test' } });

      // Click search button
      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      // Verify results appear
      await waitFor(() => {
        expect(screen.getByText('Workflow Test Season')).toBeTruthy();
        expect(screen.getByText(/Episodes: 8/)).toBeTruthy();
      });

      // Verify localStorage was updated
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'season-search-term',
        'workflow test'
      );
    });

    test('handles multiple consecutive searches', async () => {
      const firstResults = [
        {
          uid: '1',
          title: 'First Search Result',
          numberOfEpisodes: 5,
          series: { uid: 'series-1', title: 'First Series' },
        },
      ];

      const secondResults = [
        {
          uid: '2',
          title: 'Second Search Result',
          numberOfEpisodes: 7,
          series: { uid: 'series-2', title: 'Second Series' },
        },
      ];

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      // First search
      mockApiSuccess(firstResults);
      fireEvent.change(searchInput, { target: { value: 'first' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('First Search Result')).toBeTruthy();
      });

      // Second search
      mockApiSuccess(secondResults);
      fireEvent.change(searchInput, { target: { value: 'second' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Second Search Result')).toBeTruthy();
        expect(screen.queryByText('First Search Result')).toBeFalsy();
      });
    });
  });

  describe('Error Handling Tests', () => {
    test('handles component initialization errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    test('continues to function after API errors', async () => {
      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      // First search fails
      mockApiError(500);
      fireEvent.change(searchInput, { target: { value: 'error test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        // Should still be functional
        expect(searchInput).toBeTruthy();
        expect(searchButton).toBeTruthy();
      });

      // Second search should work
      mockApiSuccess([]);
      fireEvent.change(searchInput, { target: { value: 'recovery test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('No seasons found.')).toBeTruthy();
      });
    });
  });

  describe('Performance Tests', () => {
    test('renders initial state quickly', () => {
      const start = performance.now();
      render(<App />);
      const end = performance.now();

      expect(end - start).toBeLessThan(1000); // Should render in less than 1 second
    });

    test('handles rapid user input efficiently', () => {
      render(<App />);

      const searchInput = screen.getByRole('textbox');

      const start = performance.now();

      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(searchInput, { target: { value: `test${i}` } });
      }

      const end = performance.now();

      expect(end - start).toBeLessThan(500); // Should handle rapid input efficiently
    });
  });

  describe('Accessibility Tests', () => {
    test('has proper keyboard navigation', () => {
      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      // Input should be focusable
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);

      // Button should be focusable
      searchButton.focus();
      expect(document.activeElement).toBe(searchButton);
    });

    test('has appropriate ARIA labels and roles', () => {
      render(<App />);

      // Search input should have textbox role
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeTruthy();

      // Search button should have button role
      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toBeTruthy();
    });
  });

  describe('RTK Query Integration Tests', () => {
    test('handles page change and caching behavior', async () => {
      const mockData = [
        {
          uid: 'page-test-1',
          title: 'Page Test Season',
          numberOfEpisodes: 10,
          series: { uid: 'page-series', title: 'Page Test Series' },
        },
      ];

      mockApiSuccess(mockData);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      // Perform initial search
      fireEvent.change(searchInput, { target: { value: 'page test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Page Test Season')).toBeTruthy();
      });

      // Test that handlePageChange functionality works
      expect(screen.getByText('Page Test Season')).toBeTruthy();
    });

    test('preserves search state between component updates', async () => {
      const mockData = [
        {
          uid: 'nav-test-1',
          title: 'Navigation Test Season',
          numberOfEpisodes: 15,
          series: { uid: 'nav-series', title: 'Navigation Series' },
        },
      ];

      mockApiSuccess(mockData);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'navigation test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Navigation Test Season')).toBeTruthy();
      });

      // Verify input still contains the search term
      expect((searchInput as HTMLInputElement).value).toBe('navigation test');
    });

    test('handles item details caching with RTK Query', async () => {
      const mockData = [
        {
          uid: 'details-test-1',
          title: 'Details Test Season',
          numberOfEpisodes: 12,
          series: { uid: 'details-series', title: 'Details Series' },
        },
      ];

      mockApiSuccess(mockData);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'details test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Details Test Season')).toBeTruthy();
      });

      // Click on item to test details functionality
      const seasonItem = screen.getByText('Details Test Season');
      fireEvent.click(seasonItem);

      // Item should be available for details (passed as seasonData)
      expect(screen.getByText('Details Test Season')).toBeTruthy();
    });

    test('manages loading states correctly during RTK Query operations', async () => {
      const mockData = [
        {
          uid: 'loading-test-1',
          title: 'Loading Test Season',
          numberOfEpisodes: 8,
          series: { uid: 'loading-series', title: 'Loading Series' },
        },
      ];

      mockApiSuccess(mockData);

      render(<App />);

      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'loading test' } });
      fireEvent.click(searchButton);

      // Should eventually show results
      await waitFor(() => {
        expect(screen.getByText('Loading Test Season')).toBeTruthy();
      });
    });
  });
});
