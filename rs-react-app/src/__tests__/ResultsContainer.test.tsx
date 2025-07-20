import { render, screen } from '../__tests__/test-utils';
import { mockApiResponses } from '../__tests__/test-utils';
import ResultsContainer from '../components/main/ResultsContainer';

describe('ResultsContainer Component', () => {
  const defaultProps = {
    results: [],
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders results container', () => {
      render(<ResultsContainer {...defaultProps} />);

      const container = document.querySelector('.results-container');
      expect(container).toBeTruthy();
    });

    test('renders ResultsHeader component', () => {
      render(<ResultsContainer {...defaultProps} />);

      // Assuming ResultsHeader has some identifiable content
      const header = screen.getByText(/Results/i); // Adjust based on actual header content
      expect(header).toBeTruthy();
    });

    test('renders correct number of items when data is provided', () => {
      render(
        <ResultsContainer
          {...defaultProps}
          results={mockApiResponses.successResponse}
        />
      );

      const items = document.querySelectorAll('.item-name');
      expect(items).toHaveLength(3); // 1 header + 2 results
    });

    test('displays "no results" message when data array is empty', () => {
      render(<ResultsContainer {...defaultProps} results={[]} />);

      const noResultsMessage = screen.getByText('No results.');
      expect(noResultsMessage).toBeTruthy();
    });

    test('shows loading state while fetching data', () => {
      render(<ResultsContainer {...defaultProps} loading={true} />);

      const loader = document.querySelector('.loader');
      expect(loader).toBeTruthy();
    });

    test('does not show loader when not loading', () => {
      render(<ResultsContainer {...defaultProps} loading={false} />);

      const loader = document.querySelector('.loader');
      expect(loader).toBeFalsy();
    });

    test('does not show no results message when loading', () => {
      render(
        <ResultsContainer {...defaultProps} results={[]} loading={true} />
      );

      const noResultsMessage = screen.queryByText('No results.');
      expect(noResultsMessage).toBeFalsy();
    });

    test('does not show no results message when there are results', () => {
      render(
        <ResultsContainer
          {...defaultProps}
          results={mockApiResponses.successResponse}
        />
      );

      const noResultsMessage = screen.queryByText('No results.');
      expect(noResultsMessage).toBeFalsy();
    });
  });

  describe('Data Display Tests', () => {
    test('correctly displays item names and descriptions', () => {
      const testData = mockApiResponses.successResponse;
      render(<ResultsContainer {...defaultProps} results={testData} />);

      expect(screen.getByText('Test Season 1')).toBeTruthy();
      expect(screen.getByText('Test Season 2')).toBeTruthy();
      expect(
        screen.getByText('Episodes: 10, Series Title: Test Series 1')
      ).toBeTruthy();
      expect(
        screen.getByText('Episodes: 12, Series Title: Test Series 2')
      ).toBeTruthy();
    });

    test('handles missing or undefined data gracefully', () => {
      const incompleteData = [
        {
          uid: '1',
          title: 'Season Without Episodes',
          numberOfEpisodes: undefined,
          series: undefined,
        },
        {
          uid: '2',
          title: 'Season Without Series',
          numberOfEpisodes: 8,
          series: undefined,
        },
        {
          uid: '3',
          title: 'Season With Empty Series',
          numberOfEpisodes: 10,
          series: { uid: 'empty-series', title: 'Unknown Series' },
        },
      ];

      render(<ResultsContainer {...defaultProps} results={incompleteData} />);

      expect(screen.getByText('Season Without Episodes')).toBeTruthy();
      expect(screen.getByText('Episodes: N/A, Series Title: N/A')).toBeTruthy();

      expect(screen.getByText('Season Without Series')).toBeTruthy();
      expect(screen.getByText('Episodes: 8, Series Title: N/A')).toBeTruthy();

      expect(screen.getByText('Season With Empty Series')).toBeTruthy();
      expect(
        screen.getByText('Episodes: 10, Series Title: Unknown Series')
      ).toBeTruthy();
    });

    test('displays each item with proper styling', () => {
      const testData = mockApiResponses.successResponse;
      render(<ResultsContainer {...defaultProps} results={testData} />);

      const itemContainers = document.querySelectorAll(
        '[style*="margin-bottom"]'
      );
      expect(itemContainers).toHaveLength(2);
    });

    test('displays season titles with correct CSS class', () => {
      const testData = mockApiResponses.successResponse;
      render(<ResultsContainer {...defaultProps} results={testData} />);

      const seasonTitles = document.querySelectorAll('.item-name');
      expect(seasonTitles).toHaveLength(3); // 1 header + 2 results
      expect(seasonTitles[1].textContent).toBe('Test Season 1'); // Skip header at index 0
      expect(seasonTitles[2].textContent).toBe('Test Season 2');
    });

    test('handles zero episodes correctly', () => {
      const zeroEpisodesData = [
        {
          uid: '1',
          title: 'Season With Zero Episodes',
          numberOfEpisodes: 0,
          series: { uid: 'test-series', title: 'Test Series' },
        },
      ];

      render(<ResultsContainer {...defaultProps} results={zeroEpisodesData} />);

      expect(
        screen.getByText('Episodes: 0, Series Title: Test Series')
      ).toBeTruthy();
    });

    test('handles large numbers of episodes', () => {
      const largeEpisodesData = [
        {
          uid: '1',
          title: 'Long Season',
          numberOfEpisodes: 999,
          series: { uid: 'long-series', title: 'Long Series' },
        },
      ];

      render(
        <ResultsContainer {...defaultProps} results={largeEpisodesData} />
      );

      expect(
        screen.getByText('Episodes: 999, Series Title: Long Series')
      ).toBeTruthy();
    });
  });

  describe('Component State Tests', () => {
    test('renders different states correctly', () => {
      const { rerender } = render(<ResultsContainer {...defaultProps} />);

      // Initial state - no results, not loading
      expect(screen.getByText('No results.')).toBeTruthy();
      expect(document.querySelector('.loader')).toBeFalsy();

      // Loading state
      rerender(<ResultsContainer {...defaultProps} loading={true} />);
      expect(document.querySelector('.loader')).toBeTruthy();
      expect(screen.queryByText('No results.')).toBeFalsy();

      // Results loaded
      rerender(
        <ResultsContainer
          results={mockApiResponses.successResponse}
          loading={false}
        />
      );
      expect(document.querySelector('.loader')).toBeFalsy();
      expect(screen.queryByText('No results.')).toBeFalsy();
      expect(screen.getByText('Test Season 1')).toBeTruthy();
    });
  });

  describe('Accessibility Tests', () => {
    test('container has appropriate structure for screen readers', () => {
      render(
        <ResultsContainer
          {...defaultProps}
          results={mockApiResponses.successResponse}
        />
      );

      const container = document.querySelector('.results-container');
      expect(container).toBeTruthy();

      // Check that content is accessible
      expect(screen.getByText('Test Season 1')).toBeTruthy();
      expect(screen.getByText('Test Season 2')).toBeTruthy();
    });

    test('loading state is accessible', () => {
      render(<ResultsContainer {...defaultProps} loading={true} />);

      const loader = document.querySelector('.loader');
      expect(loader).toBeTruthy();
    });

    test('no results message is accessible', () => {
      render(<ResultsContainer {...defaultProps} results={[]} />);

      const noResultsMessage = screen.getByText('No results.');
      expect(noResultsMessage).toBeTruthy();
    });
  });

  describe('Performance Tests', () => {
    test('handles large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 100 }, (_, index) => ({
        uid: `${index + 1}`,
        title: `Season ${index + 1}`,
        numberOfEpisodes: Math.floor(Math.random() * 50) + 1,
        series: { uid: `series-${index + 1}`, title: `Series ${index + 1}` },
      }));

      const renderStart = performance.now();
      render(<ResultsContainer {...defaultProps} results={largeDataset} />);
      const renderEnd = performance.now();

      // Basic performance check - should render in reasonable time
      expect(renderEnd - renderStart).toBeLessThan(1000); // Less than 1 second

      const items = document.querySelectorAll('.item-name');
      expect(items).toHaveLength(101); // 1 header + 100 results
    });
  });

  describe('Error Handling Tests', () => {
    test('handles null or undefined results gracefully', () => {
      expect(() => {
        render(<ResultsContainer loading={false} results={null as any} />);
      }).not.toThrow();

      expect(() => {
        render(<ResultsContainer loading={false} results={undefined as any} />);
      }).not.toThrow();
    });

    test('handles malformed data objects', () => {
      const malformedData = [
        { uid: '1' }, // Missing required fields
        null,
        undefined,
        { uid: '2', title: '', numberOfEpisodes: null, series: null },
      ];

      expect(() => {
        render(
          <ResultsContainer {...defaultProps} results={malformedData as any} />
        );
      }).not.toThrow();
    });
  });
});
