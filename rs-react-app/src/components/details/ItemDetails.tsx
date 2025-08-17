'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  useAppSelector,
  useAppDispatch,
  useGetSeasonDetailsQuery,
} from '../../store/hooks';
import {
  closeDetails,
  setItemDetails,
} from '../../store/slices/itemDetailsSlice';
import Loader from '../loader/loader';
import { formatDateForDisplay } from '../../utils/dateFormatting';
import './ItemDetails.css';

const ItemDetails: React.FC = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const params = useParams();
  const { selectedItem, isOpen } = useAppSelector((state) => state.itemDetails);

  // Use RTK Query to fetch season details if we have a detailsId but no selectedItem
  const shouldFetchDetails = isOpen && params.detailsId && !selectedItem;
  const {
    data: seasonDetailsData,
    isLoading: isRTKLoading,
    error: rtkError,
  } = useGetSeasonDetailsQuery(
    Array.isArray(params.detailsId)
      ? params.detailsId[0] || ''
      : params.detailsId || '',
    {
      skip: !shouldFetchDetails,
    }
  );

  // Update the Redux store when RTK Query data is available
  React.useEffect(() => {
    if (seasonDetailsData && shouldFetchDetails) {
      dispatch(setItemDetails(seasonDetailsData));
    }
  }, [seasonDetailsData, shouldFetchDetails, dispatch]);

  const handleClose = () => {
    dispatch(closeDetails());
  };

  if (!isOpen) {
    return null;
  }

  // Determine loading and error states (prefer RTK Query states when fetching)
  const loading = shouldFetchDetails ? isRTKLoading : false;
  const error =
    shouldFetchDetails && rtkError
      ? typeof rtkError === 'object' && 'message' in rtkError
        ? (rtkError as { message: string }).message
        : 'Failed to load season details'
      : null;

  return (
    <div className="item-details-overlay">
      <div className="item-details-container">
        <div className="item-details-header">
          <h2>{t('details.title')}</h2>
          <button
            className="item-details-close"
            onClick={handleClose}
            aria-label={t('details.close')}
            title={t('details.close')}
          >
            ✕
          </button>
        </div>

        <div className="item-details-content">
          {loading && (
            <div className="item-details-loading">
              <Loader />
              <p>{t('details.loading')}</p>
            </div>
          )}

          {error && (
            <div className="item-details-error">
              <h3>{t('details.unavailable')}</h3>
              <div className="error-content">
                <p className="error-message">
                  {error.includes('404') || error.includes('not found')
                    ? t('details.error.notFound')
                    : t('details.error.generic')}
                </p>
                <p className="error-suggestion">
                  {t('details.error.suggestion')}
                </p>
              </div>
              <button onClick={handleClose} className="error-close-btn">
                {t('details.close')}
              </button>
            </div>
          )}

          {selectedItem && !loading && (
            <div className="item-details-data">
              <div className="detail-section">
                <h3>{selectedItem.title}</h3>
                {selectedItem.series && (
                  <p className="series-info">
                    <strong>Series:</strong> {selectedItem.series.title}
                  </p>
                )}
              </div>

              <div className="detail-section">
                <h4>Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Episodes:</strong>
                    <span>{selectedItem.numberOfEpisodes || 'N/A'}</span>
                  </div>
                  {selectedItem.originalRunStartDate && (
                    <div className="detail-item">
                      <strong>Start Date:</strong>
                      <span>
                        {formatDateForDisplay(
                          selectedItem.originalRunStartDate
                        )}
                      </span>
                    </div>
                  )}
                  {selectedItem.originalRunEndDate && (
                    <div className="detail-item">
                      <strong>End Date:</strong>
                      <span>
                        {formatDateForDisplay(selectedItem.originalRunEndDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedItem.productionCompany && (
                <div className="detail-section">
                  <h4>Production</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Production Company:</strong>
                      <span>{selectedItem.productionCompany.name}</span>
                    </div>
                    {selectedItem.originalBroadcaster && (
                      <div className="detail-item">
                        <strong>Original Broadcaster:</strong>
                        <span>{selectedItem.originalBroadcaster.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedItem.episodes && selectedItem.episodes.length > 0 && (
                <div className="detail-section">
                  <h4>Episodes ({selectedItem.episodes.length})</h4>
                  <div className="episodes-list">
                    {selectedItem.episodes.slice(0, 5).map((episode) => (
                      <div key={episode.uid} className="episode-item">
                        <span className="episode-number">
                          S{episode.seasonNumber}E{episode.episodeNumber}
                        </span>
                        <span className="episode-title">{episode.title}</span>
                      </div>
                    ))}
                    {selectedItem.episodes.length > 5 && (
                      <p className="episodes-more">
                        ... and {selectedItem.episodes.length - 5} more episodes
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Additional details sections */}
              {(selectedItem.titleGerman ||
                selectedItem.titleItalian ||
                selectedItem.titleJapanese) && (
                <div className="detail-section">
                  <h4>Alternative Titles</h4>
                  <div className="detail-grid">
                    {selectedItem.titleGerman && (
                      <div className="detail-item">
                        <strong>German:</strong>
                        <span>{selectedItem.titleGerman}</span>
                      </div>
                    )}
                    {selectedItem.titleItalian && (
                      <div className="detail-item">
                        <strong>Italian:</strong>
                        <span>{selectedItem.titleItalian}</span>
                      </div>
                    )}
                    {selectedItem.titleJapanese && (
                      <div className="detail-item">
                        <strong>Japanese:</strong>
                        <span>{selectedItem.titleJapanese}</span>
                      </div>
                    )}
                    {selectedItem.titlePolish && (
                      <div className="detail-item">
                        <strong>Polish:</strong>
                        <span>{selectedItem.titlePolish}</span>
                      </div>
                    )}
                    {selectedItem.titleRussian && (
                      <div className="detail-item">
                        <strong>Russian:</strong>
                        <span>{selectedItem.titleRussian}</span>
                      </div>
                    )}
                    {selectedItem.titleSpanish && (
                      <div className="detail-item">
                        <strong>Spanish:</strong>
                        <span>{selectedItem.titleSpanish}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
