'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearSelection } from '../../store/slices/selectedItemsSlice';
import type { Season } from '../../interfaces/interface';
import { downloadFile } from '../../utils/fileDownload';
import './DownloadFlyout.css';

const DownloadFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedSeasons } = useAppSelector((state) => state.selectedItems);

  if (selectedSeasons.length === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearSelection());
  };

  const prepareDownloadData = (items: Season[]) => {
    return items.map((item) => ({
      title: item.title || '',
      series: item.series?.title || '',
      seasonnumber: '',
      numberofepisodes: item.numberOfEpisodes || '',
      startdate: item.originalRunStartDate || '',
      enddate: item.originalRunEndDate || '',
      detailsurl: item.uid ? `https://stapi.co/season/${item.uid}` : '',
      uid: item.uid || '',
    }));
  };

  const handleDownload = () => {
    const headers = [
      'Title',
      'Series',
      'Season Number',
      'Number of Episodes',
      'Start Date',
      'End Date',
      'Details URL',
      'UID',
    ];

    const downloadData = prepareDownloadData(selectedSeasons);
    const csvContent =
      headers.join(',') +
      '\n' +
      downloadData
        .map((item) =>
          Object.values(item)
            .map((value) => {
              const stringValue = String(value);
              // Escape quotes and wrap in quotes if contains comma, quote, or newline
              if (
                stringValue.includes(',') ||
                stringValue.includes('"') ||
                stringValue.includes('\n')
              ) {
                return `"${stringValue.replace(/"/g, '""')}"`;
              }
              return stringValue;
            })
            .join(',')
        )
        .join('\n');

    const filename = `${selectedSeasons.length}_items.csv`;

    downloadFile({
      filename,
      data: [csvContent],
      content: csvContent,
      mimeType: 'text/csv',
    });
  };

  const itemText = selectedSeasons.length === 1 ? 'item is' : 'items are';

  return (
    <div
      className="download-flyout"
      role="banner"
      aria-label="Download selected items"
    >
      <div className="flyout-content">
        <div className="flyout-info">
          <span className="selection-count">
            {selectedSeasons.length} {itemText} selected
          </span>
        </div>

        <div className="flyout-actions">
          <button
            className="flyout-btn flyout-btn-secondary"
            onClick={handleUnselectAll}
            aria-label="Unselect all items"
          >
            Unselect all
          </button>

          <button
            className="flyout-btn flyout-btn-primary"
            onClick={handleDownload}
            aria-label={`Download ${selectedSeasons.length} selected items as CSV`}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadFlyout;
