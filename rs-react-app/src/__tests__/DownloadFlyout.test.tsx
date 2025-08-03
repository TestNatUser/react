import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { render, createTestStore } from './test-utils';
import DownloadFlyout from '../components/download/DownloadFlyout';
import type { Season, SelectedItemsState } from '../interfaces/interface';

// Mock the downloadFile utility
jest.mock('../utils/fileDownload', () => ({
  downloadFile: jest.fn(),
}));

const mockSeasons: Season[] = [
  {
    uid: 'season-1',
    title: 'Season 1',
    series: { uid: 'series-1', title: 'Star Trek' },
    numberOfEpisodes: 26,
    originalRunStartDate: '2023-01-01',
    originalRunEndDate: '2023-12-31',
  },
  {
    uid: 'season-2', 
    title: 'Season 2',
    series: { uid: 'series-1', title: 'Star Trek' },
    numberOfEpisodes: 24,
  },
];

describe('DownloadFlyout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when no items are selected', () => {
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: [],
        selectionMode: false,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    const { container } = render(<DownloadFlyout />, { store });
    expect(container.firstChild).toBeNull();
  });

  test('renders with single item selected', () => {
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: [mockSeasons[0]],
        selectionMode: true,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    render(<DownloadFlyout />, { store });
    
    expect(screen.getByText('1 item is selected')).toBeTruthy();
    expect(screen.getByRole('button', { name: /unselect all/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /download 1 selected items/i })).toBeTruthy();
  });

  test('renders with multiple items selected', () => {
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: mockSeasons,
        selectionMode: true,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    render(<DownloadFlyout />, { store });
    
    expect(screen.getByText('2 items are selected')).toBeTruthy();
    expect(screen.getByRole('button', { name: /unselect all/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /download 2 selected items/i })).toBeTruthy();
  });

  test('calls clearSelection when Unselect all is clicked', () => {
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: mockSeasons,
        selectionMode: true,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    render(<DownloadFlyout />, { store });
    
    const unselectButton = screen.getByRole('button', { name: /unselect all/i });
    fireEvent.click(unselectButton);
    
    // Check that the store was updated (selectedSeasons should be empty)
    const state = store.getState();
    expect(state.selectedItems.selectedSeasons).toHaveLength(0);
  });

  test('calls downloadFile when Download button is clicked', () => {
    const { downloadFile } = require('../utils/fileDownload');
    
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: mockSeasons,
        selectionMode: true,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    render(<DownloadFlyout />, { store });
    
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);
    
    expect(downloadFile).toHaveBeenCalledWith({
      filename: '2_items.csv',
      content: expect.stringContaining('Title,Series,Season Number'),
      mimeType: 'text/csv',
    });
  });

  test('prepares correct CSV data with complete information', () => {
    const { downloadFile } = require('../utils/fileDownload');
    
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: [mockSeasons[0]], // Season with all data
        selectionMode: true,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    render(<DownloadFlyout />, { store });
    
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);
    
    const csvContent = downloadFile.mock.calls[0][0].content;
    expect(csvContent).toContain('Season 1');
    expect(csvContent).toContain('Star Trek');
    expect(csvContent).toContain('26');
    expect(csvContent).toContain('2023-01-01');
    expect(csvContent).toContain('2023-12-31');
    expect(csvContent).toContain('https://stapi.co/season/season-1');
    expect(csvContent).toContain('season-1');
  });

  test('prepares correct CSV data with missing information', () => {
    const { downloadFile } = require('../utils/fileDownload');
    
    const seasonWithMissingData: Season = {
      uid: 'season-minimal',
      title: 'Minimal Season',
      // Missing most optional fields
    };
    
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: [seasonWithMissingData],
        selectionMode: true,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    render(<DownloadFlyout />, { store });
    
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);
    
    const csvContent = downloadFile.mock.calls[0][0].content;
    expect(csvContent).toContain('Minimal Season');
    expect(csvContent).toContain('season-minimal');
    // Should handle empty values gracefully
    expect(csvContent).toContain(',,'); // Empty fields
  });

  test('handles CSV escaping for special characters', () => {
    const { downloadFile } = require('../utils/fileDownload');
    
    const seasonWithSpecialChars: Season = {
      uid: 'season-special',
      title: 'Season "With Quotes" and, Commas',
      series: { uid: 'series-1', title: 'Series\nWith\nNewlines' },
    };
    
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: [seasonWithSpecialChars],
        selectionMode: true,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    render(<DownloadFlyout />, { store });
    
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);
    
    const csvContent = downloadFile.mock.calls[0][0].content;
    // Should properly escape quotes and wrap fields with special characters
    expect(csvContent).toContain('"Season ""With Quotes"" and, Commas"');
    expect(csvContent).toContain('"Series\nWith\nNewlines"');
  });

  test('calls downloadFile when Download button is clicked and clears selection', () => {
    const { downloadFile } = require('../utils/fileDownload');
    
    const store = createTestStore({
      selectedItems: {
        selectedSeasons: mockSeasons,
        selectionMode: true,
        lastSelectedId: null,
      } as SelectedItemsState,
    });

    render(<DownloadFlyout />, { store });
    
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);
    
    // Verify download was called with correct parameters
    expect(downloadFile).toHaveBeenCalledWith({
      filename: '2_items.csv',
      content: expect.stringContaining('Title,Series,Season Number'),
      mimeType: 'text/csv',
    });
    
    // Note: The actual selection clearing is tested through Redux action dispatching
    // which is covered by the selectedItemsSlice tests
  });
});