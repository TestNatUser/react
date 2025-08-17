import selectedItemsReducer, {
  toggleSelection,
  selectAll,
  clearSelection,
  setSelectionMode,
  removeSelected,
  type SelectedItemsState,
} from '../store/slices/selectedItemsSlice';
import type { Season } from '../interfaces/interface';

const mockSeason1: Season = {
  uid: 'season-1',
  title: 'Season 1',
  series: { uid: 'series-1', title: 'Star Trek' },
  seasonNumber: 1,
  numberOfEpisodes: 26,
};

const mockSeason2: Season = {
  uid: 'season-2',
  title: 'Season 2',
  series: { uid: 'series-1', title: 'Star Trek' },
  seasonNumber: 2,
  numberOfEpisodes: 24,
};

describe('selectedItemsSlice', () => {
  const initialState: SelectedItemsState = {
    selectedSeasons: [],
    selectionMode: false,
    lastSelectedId: null,
  };

  test('should return initial state', () => {
    expect(selectedItemsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('toggleSelection should add item if not selected', () => {
    const action = toggleSelection(mockSeason1);
    const state = selectedItemsReducer(initialState, action);

    expect(state.selectedSeasons).toHaveLength(1);
    expect(state.selectedSeasons[0]).toEqual(mockSeason1);
    expect(state.lastSelectedId).toBe('season-1');
  });

  test('toggleSelection should remove item if already selected', () => {
    const stateWithSelection = {
      ...initialState,
      selectedSeasons: [mockSeason1],
    };

    const action = toggleSelection(mockSeason1);
    const state = selectedItemsReducer(stateWithSelection, action);

    expect(state.selectedSeasons).toHaveLength(0);
    expect(state.lastSelectedId).toBe('season-1');
  });

  test('toggleSelection should add second item without removing first', () => {
    const stateWithSelection = {
      ...initialState,
      selectedSeasons: [mockSeason1],
    };

    const action = toggleSelection(mockSeason2);
    const state = selectedItemsReducer(stateWithSelection, action);

    expect(state.selectedSeasons).toHaveLength(2);
    expect(state.selectedSeasons).toContain(mockSeason1);
    expect(state.selectedSeasons).toContain(mockSeason2);
    expect(state.lastSelectedId).toBe('season-2');
  });

  test('selectAll should replace all selected items', () => {
    const stateWithSelection = {
      ...initialState,
      selectedSeasons: [mockSeason1],
    };

    const newSeasons = [mockSeason2];
    const action = selectAll(newSeasons);
    const state = selectedItemsReducer(stateWithSelection, action);

    expect(state.selectedSeasons).toEqual(newSeasons);
    expect(state.selectedSeasons).toHaveLength(1);
    expect(state.selectedSeasons[0]).toEqual(mockSeason2);
  });

  test('clearSelection should remove all selected items', () => {
    const stateWithSelection = {
      ...initialState,
      selectedSeasons: [mockSeason1, mockSeason2],
      lastSelectedId: 'season-2',
    };

    const action = clearSelection();
    const state = selectedItemsReducer(stateWithSelection, action);

    expect(state.selectedSeasons).toHaveLength(0);
    expect(state.lastSelectedId).toBeNull();
  });

  test('setSelectionMode should enable selection mode', () => {
    const action = setSelectionMode(true);
    const state = selectedItemsReducer(initialState, action);

    expect(state.selectionMode).toBe(true);
  });

  test('setSelectionMode should disable selection mode and clear selections', () => {
    const stateWithSelections = {
      ...initialState,
      selectionMode: true,
      selectedSeasons: [mockSeason1, mockSeason2],
      lastSelectedId: 'season-2',
    };

    const action = setSelectionMode(false);
    const state = selectedItemsReducer(stateWithSelections, action);

    expect(state.selectionMode).toBe(false);
    expect(state.selectedSeasons).toHaveLength(0);
    expect(state.lastSelectedId).toBeNull();
  });

  test('removeSelected should remove specific item by uid', () => {
    const stateWithSelections = {
      ...initialState,
      selectedSeasons: [mockSeason1, mockSeason2],
    };

    const action = removeSelected('season-1');
    const state = selectedItemsReducer(stateWithSelections, action);

    expect(state.selectedSeasons).toHaveLength(1);
    expect(state.selectedSeasons[0]).toEqual(mockSeason2);
    expect(
      state.selectedSeasons.find((s) => s.uid === 'season-1')
    ).toBeUndefined();
  });

  test('removeSelected should handle non-existent uid gracefully', () => {
    const stateWithSelections = {
      ...initialState,
      selectedSeasons: [mockSeason1],
    };

    const action = removeSelected('non-existent-id');
    const state = selectedItemsReducer(stateWithSelections, action);

    expect(state.selectedSeasons).toHaveLength(1);
    expect(state.selectedSeasons[0]).toEqual(mockSeason1);
  });
});
