import { useIntl } from 'react-intl';
import type { ResultsContainerProps, Season } from '../../interfaces/interface';
import type { RootState } from '../../store/store';
import Loader from '../loader/loader.tsx';
import ResultsHeader from '../main/ResultsHeader';
import SelectionControls from './SelectionControls';
import ResultsItemHint from './ResultsItemHint';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSelection } from '../../store/slices/selectedItemsSlice';

const ResultsContainer = ({
  results,
  loading,
  onItemClick,
}: ResultsContainerProps) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const selectedItemsState = useAppSelector(
    (state: RootState) => state.selectedItems
  );
  const selectedSeasons = selectedItemsState.selectedSeasons;
  const selectionMode = selectedItemsState.selectionMode;

  // Handle null/undefined results safely
  const safeResults = results || [];

  const handleItemClick = (season: Season) => {
    if (selectionMode) {
      dispatch(toggleSelection(season));
    } else {
      // Open details panel - pass the season data directly instead of just the ID
      if (onItemClick && season?.uid) {
        onItemClick(season.uid, season);
      }
    }
  };

  const isSelected = (seasonId: string) => {
    return selectedSeasons.some((season: Season) => season.uid === seasonId);
  };

  return (
    <div className="results-container">
      <ResultsHeader />
      <SelectionControls availableSeasons={safeResults} />
      {!loading && safeResults.length > 0 && !selectionMode && (
        <ResultsItemHint />
      )}
      {loading && <Loader />}
      {!loading && safeResults.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>{intl.formatMessage({ id: 'search.noResults' })}</p>
          <p style={{ fontSize: '0.9em', marginTop: '0.5rem' }}>
            {intl.formatMessage({ id: 'search.noResultsHint' })}
          </p>
        </div>
      )}
      {safeResults.map((season) => (
        <div
          key={season?.uid || Math.random()}
          className={`result-item ${selectionMode ? 'selectable' : ''} ${isSelected(season?.uid) ? 'selected' : ''}`}
          onClick={() => handleItemClick(season)}
          style={{ marginBottom: 6 }}
        >
          {selectionMode && (
            <input
              type="checkbox"
              checked={isSelected(season?.uid)}
              onChange={() => handleItemClick(season)}
              className="selection-checkbox"
            />
          )}
          <span className="item-name">{season?.title || 'N/A'}</span>
          <span>
            {intl.formatMessage({ id: 'details.episodes' }, { count: season?.numberOfEpisodes ?? 'N/A' })}, {intl.formatMessage({ id: 'details.series' }, { title: season?.series?.title ?? 'N/A' })}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ResultsContainer;
