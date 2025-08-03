import type { AppContainerProps } from '../../interfaces/interface';
import Header from '../header/Header.tsx';
import ErrorButton from '../error/ErrorButton';
import ResultsContainer from '../main/ResultsContainer';
import { ErrorBoundary } from '../error/Error';
import ApiStatus from '../common/ApiStatus';
import Pagination from '../common/Pagination';

/**
 * AppContainer component that provides the main layout structure
 */
const AppContainer = ({
  query,
  onInputChange,
  onSearch,
  results,
  loading,
  error,
  pagination,
  onPageChange,
}: AppContainerProps) => {
  return (
    <div className="app-container">
      <Header query={query} onInputChange={onInputChange} onSearch={onSearch} />
      <ApiStatus error={error} />
      <ResultsContainer results={results} loading={loading} />
      {pagination && onPageChange && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    </div>
  );
};

export default AppContainer;
