import type { AppContainerProps } from '../../interfaces/interface';
import Header from '../header/Header.tsx';
import ErrorButton from '../error/ErrorButton';
import ResultsContainer from '../main/ResultsContainer';
import { ErrorBoundary } from '../error/Error';
import ApiStatus from '../common/ApiStatus';
import Pagination from '../common/Pagination';
import ItemDetails from '../details/ItemDetails';
import Footer from '../footer/Footer';
import DownloadFlyout from '../download/DownloadFlyout';
import './AppContainer.css';

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
  onItemClick,
  isDetailsOpen = false,
}: AppContainerProps) => {
  return (
    <div className={`app-container ${isDetailsOpen ? 'split-layout' : ''}`}>
      <div className="main-content">
        <Header query={query} onInputChange={onInputChange} onSearch={onSearch} />
        <ApiStatus error={error} />
        <ResultsContainer 
          results={results} 
          loading={loading} 
          onItemClick={onItemClick}
        />
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
        
        <Footer />
      </div>
      
      {/* Details panel */}
      <ItemDetails />
      
      {/* Download flyout */}
      <DownloadFlyout />
    </div>
  );
};

export default AppContainer;
