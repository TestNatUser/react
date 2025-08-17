import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Season, SelectedItemsState } from '../../interfaces/interface';

const initialState: SelectedItemsState = {
  selectedSeasons: [],
  selectionMode: false,
  lastSelectedId: null,
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<Season>) => {
      const season = action.payload;
      const existingIndex = state.selectedSeasons.findIndex(
        (item) => item.uid === season.uid
      );

      if (existingIndex >= 0) {
        // Remove if already selected
        state.selectedSeasons.splice(existingIndex, 1);
      } else {
        // Add if not selected
        state.selectedSeasons.push(season);
      }

      state.lastSelectedId = season.uid;
    },

    selectAll: (state, action: PayloadAction<Season[]>) => {
      state.selectedSeasons = [...action.payload];
    },

    clearSelection: (state) => {
      state.selectedSeasons = [];
      state.lastSelectedId = null;
    },

    setSelectionMode: (state, action: PayloadAction<boolean>) => {
      state.selectionMode = action.payload;
      if (!action.payload) {
        // Clear selection when exiting selection mode
        state.selectedSeasons = [];
        state.lastSelectedId = null;
      }
    },

    removeSelected: (state, action: PayloadAction<string>) => {
      state.selectedSeasons = state.selectedSeasons.filter(
        (item) => item.uid !== action.payload
      );
    },
  },
});

export const {
  toggleSelection,
  selectAll,
  clearSelection,
  setSelectionMode,
  removeSelected,
} = selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
