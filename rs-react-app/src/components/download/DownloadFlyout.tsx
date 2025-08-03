import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearAll } from '../../store/slices/selectedItemsSlice';
import type { Season } from '../../interfaces/interface';
import './DownloadFlyout.css';

const DownloadFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedSeasons } = useAppSelector((state) => state.selectedItems);

  if (selectedSeasons.length === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearAll());
  };

  const convertToCSV = (items: Season[]): string => {
    const headers = [
      'Title',
      'Series',
      'Season Number',
      'Number of Episodes',
      'Start Date',
      'End Date',
      'Details URL',
      'UID'
    ];

    const csvRows = [
      headers.join(','),
      ...items.map(item => [
        `"${(item.title || '').replace(/"/g, '""')}"`,
        `"${(item.series?.title || '').replace(/"/g, '""')}"`,
        item.seasonNumber || '',
        item.numberOfEpisodes || '',
        item.originalRunStartDate || '',
        item.originalRunEndDate || '',
        item.uid ? `"https://stapi.co/season/${item.uid}"` : '',
        item.uid || ''
      ].join(','))
    ];

    return csvRows.join('\n');
  };

  const handleDownload = () => {
    const csvContent = convertToCSV(selectedSeasons);
    const filename = `${selectedSeasons.length}_items.csv`;
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback for older browsers
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  };

  const itemText = selectedSeasons.length === 1 ? 'item is' : 'items are';

  return (
    <div className="download-flyout" role="banner" aria-label="Download selected items">
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