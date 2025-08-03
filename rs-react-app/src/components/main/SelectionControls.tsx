import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setSelectionMode,
  clearSelection,
  selectAll,
} from '../../store/slices/selectedItemsSlice';
import type { SelectionControlsProps } from '../../interfaces/interface';
import './SelectionControls.css';

const SelectionControls: React.FC<SelectionControlsProps> = ({
  availableSeasons,
}) => {
  const dispatch = useAppDispatch();
  const { selectedSeasons, selectionMode } = useAppSelector(
    (state) => state.selectedItems
  );

  const handleToggleSelectionMode = () => {
    dispatch(setSelectionMode(!selectionMode));
  };

  const handleSelectAll = () => {
    dispatch(selectAll(availableSeasons));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  return (
    <div className="selection-controls">
      <div className="selection-info">
        <span className="selection-count">
          {selectedSeasons.length} item{selectedSeasons.length !== 1 ? 's' : ''}{' '}
          selected
        </span>
        <button
          className="selection-mode-btn"
          onClick={handleToggleSelectionMode}
        >
          {selectionMode ? 'Exit Selection' : 'Select Items'}
        </button>
      </div>

      {selectionMode && (
        <div className="selection-actions">
          <button
            className="select-all-btn"
            onClick={handleSelectAll}
            disabled={availableSeasons.length === 0}
          >
            Select All ({availableSeasons.length})
          </button>
          <button
            className="clear-selection-btn"
            onClick={handleClearSelection}
            disabled={selectedSeasons.length === 0}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectionControls;
