'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearSelection } from '../../store/slices/selectedItemsSlice';
// Client-side CSV generation
import { generateCSV } from '../../utils/csvGenerator';
import './DownloadFlyout.css';

const DownloadFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedSeasons } = useAppSelector((state) => state.selectedItems);
  const [isGenerating, setIsGenerating] = useState(false);

  if (selectedSeasons.length === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearSelection());
  };

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // Get UIDs of selected seasons
      const seasonIds = selectedSeasons
        .map((season) => season.uid)
        .filter(Boolean) as string[];

      if (seasonIds.length === 0) {
        alert('No valid season IDs found for download');
        return;
      }

      // Call server action to generate CSV
      const csvContent = await generateCSV(seasonIds);

      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${selectedSeasons.length}_items.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('CSV generation failed:', error);
      alert('Failed to generate CSV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
            disabled={isGenerating}
            aria-label={`Download ${selectedSeasons.length} selected items as CSV`}
          >
            {isGenerating ? 'Generating...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadFlyout;
