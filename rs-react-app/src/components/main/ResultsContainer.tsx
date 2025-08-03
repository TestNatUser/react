import type { ResultsContainerProps } from '../../interfaces/interface';
import Loader from '../loader/Loader.tsx';
import ResultsHeader from '../main/ResultsHeader';
import SelectionControls from './SelectionControls';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSelection } from '../../store/slices/selectedItemsSlice';

const ResultsContainer = ({ results, loading }: ResultsContainerProps) => {
  const dispatch = useAppDispatch();
  const { selectedSeasons, selectionMode } = useAppSelector((state) => state.selectedItems);
  
  // Handle null/undefined results safely
  const safeResults = results || [];

  const handleItemClick = (season: any) => {
    if (selectionMode) {
      dispatch(toggleSelection(season));
    }
  };

  const isSelected = (seasonId: string) => {
    return selectedSeasons.some(season => season.uid === seasonId);
  };

  return (
    <div className="results-container">
      <ResultsHeader />
      <SelectionControls availableSeasons={safeResults} />
      {loading && <Loader />}
      {!loading && safeResults.length === 0 && <div>No results.</div>}
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
            Episodes: {season?.numberOfEpisodes ?? 'N/A'}, Series Title:{' '}
            {season?.series?.title ?? 'N/A'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ResultsContainer;
