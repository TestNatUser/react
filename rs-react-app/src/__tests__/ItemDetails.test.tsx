import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { render, createTestStore } from './test-utils';
import ItemDetails from '../components/details/ItemDetails';
import type { ItemDetailsState } from '../interfaces/interface';

describe('ItemDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when isOpen is false', () => {
    const store = createTestStore({
      itemDetails: {
        selectedItem: null,
        loading: false,
        error: null,
        isOpen: false,
      } as ItemDetailsState,
    });

    const { container } = render(<ItemDetails />, { store });
    expect(container.firstChild).toBeNull();
  });

  test('renders loading state', () => {
    const store = createTestStore({
      itemDetails: {
        selectedItem: null,
        loading: true,
        error: null,
        isOpen: true,
      } as ItemDetailsState,
    });

    render(<ItemDetails />, { store });
    expect(screen.getByText('Loading season details...')).toBeTruthy();
  });

  test('renders error state with close button', () => {
    const store = createTestStore({
      itemDetails: {
        selectedItem: null,
        loading: false,
        error: 'Failed to load item details',
        isOpen: true,
      } as ItemDetailsState,
    });

    render(<ItemDetails />, { store });
    expect(screen.getByText('Failed to load item details')).toBeTruthy();
    expect(screen.getByText('Close')).toBeTruthy();
  });

  test('renders item details with all information', () => {
    const mockItem = {
      uid: 'season-1',
      title: 'Star Trek Season 1',
      titleGerman: 'Star Trek Staffel 1',
      numberOfEpisodes: 26,
      originalRunStartDate: '2023-01-01',
      originalRunEndDate: '2023-12-31',
      series: {
        uid: 'series-1',
        title: 'Star Trek Original Series',
      },
      episodes: [
        {
          uid: 'episode-1',
          title: 'The Cage',
          seasonNumber: 1,
          episodeNumber: 1,
        },
        {
          uid: 'episode-2',
          title: 'Where No Man Has Gone Before',
          seasonNumber: 1,
          episodeNumber: 2,
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

    const store = createTestStore({
      itemDetails: {
        selectedItem: mockItem,
        loading: false,
        error: null,
        isOpen: true,
      } as ItemDetailsState,
    });

    render(<ItemDetails />, { store });

    expect(screen.getByText('Star Trek Season 1')).toBeTruthy();
    expect(screen.getByText('Star Trek Original Series')).toBeTruthy();
    expect(screen.getByText('26')).toBeTruthy();
    expect(screen.getByText('1/1/2023')).toBeTruthy();
    expect(screen.getByText('12/31/2023')).toBeTruthy();
    expect(screen.getByText('Paramount Pictures')).toBeTruthy();
    expect(screen.getByText('CBS')).toBeTruthy();
    expect(screen.getByText('Star Trek Staffel 1')).toBeTruthy();
  });

  test('renders item details with missing optional information', () => {
    const mockItem = {
      uid: 'season-1',
      title: 'Star Trek Season 1',
      series: {
        uid: 'series-1',
        title: 'Star Trek Original Series',
      },
    };

    const store = createTestStore({
      itemDetails: {
        selectedItem: mockItem,
        loading: false,
        error: null,
        isOpen: true,
      } as ItemDetailsState,
    });

    render(<ItemDetails />, { store });

    expect(screen.getByText('Star Trek Season 1')).toBeTruthy();
    expect(screen.getByText('Star Trek Original Series')).toBeTruthy();
    // Should show N/A for missing data
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });

  test('handles close button click', () => {
    const store = createTestStore({
      itemDetails: {
        selectedItem: {
          uid: 'season-1',
          title: 'Star Trek Season 1',
        },
        loading: false,
        error: null,
        isOpen: true,
      } as ItemDetailsState,
    });

    render(<ItemDetails />, { store });

    const closeButton = screen.getByRole('button', { name: /close details/i });
    fireEvent.click(closeButton);

    // Check that closeDetails action was dispatched
    const state = store.getState();
    expect(state.itemDetails.isOpen).toBe(false);
  });

  test('handles invalid date gracefully', () => {
    const mockItem = {
      uid: 'season-1',
      title: 'Star Trek Season 1',
      originalRunStartDate: 'invalid-date',
      originalRunEndDate: '2023-12-31',
    };

    const store = createTestStore({
      itemDetails: {
        selectedItem: mockItem,
        loading: false,
        error: null,
        isOpen: true,
      } as ItemDetailsState,
    });

    render(<ItemDetails />, { store });

    // Should display "Invalid Date" for invalid date strings
    expect(screen.getByText('Invalid Date')).toBeTruthy();
    expect(screen.getByText('12/31/2023')).toBeTruthy();
  });

  test('renders episodes list with limit', () => {
    const episodes = Array.from({ length: 10 }, (_, i) => ({
      uid: `episode-${i + 1}`,
      title: `Episode ${i + 1}`,
      seasonNumber: 1,
      episodeNumber: i + 1,
    }));

    const mockItem = {
      uid: 'season-1',
      title: 'Star Trek Season 1',
      episodes,
    };

    const store = createTestStore({
      itemDetails: {
        selectedItem: mockItem,
        loading: false,
        error: null,
        isOpen: true,
      } as ItemDetailsState,
    });

    render(<ItemDetails />, { store });

    expect(screen.getByText('Episodes (10)')).toBeTruthy();
    expect(screen.getByText('Episode 1')).toBeTruthy();
    expect(screen.getByText('... and 5 more episodes')).toBeTruthy();
  });

  test('renders all episodes when count is 5 or less', () => {
    const episodes = Array.from({ length: 3 }, (_, i) => ({
      uid: `episode-${i + 1}`,
      title: `Episode ${i + 1}`,
      seasonNumber: 1,
      episodeNumber: i + 1,
    }));

    const mockItem = {
      uid: 'season-1',
      title: 'Star Trek Season 1',
      episodes,
    };

    const store = createTestStore({
      itemDetails: {
        selectedItem: mockItem,
        loading: false,
        error: null,
        isOpen: true,
      } as ItemDetailsState,
    });

    render(<ItemDetails />, { store });

    expect(screen.getByText('Episodes (3)')).toBeTruthy();
    expect(screen.getByText('Episode 1')).toBeTruthy();
    expect(screen.getByText('Episode 3')).toBeTruthy();
    expect(screen.queryByText(/... and .* more episodes/)).toBeNull();
  });
});
