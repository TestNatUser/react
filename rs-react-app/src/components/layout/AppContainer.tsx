import type { AppContainerProps } from '../../interfaces/interface';
import Header from '../header/Header.tsx';
import ErrorButton from '../error/ErrorButton';
import ResultsContainer from '../main/ResultsContainer';
import { ErrorBoundary } from '../error/Error';

/**
 * AppContainer component that provides the main layout structure
 */
const AppContainer = ({
  query,
  onInputChange,
  onSearch,
  results,
  loading,
}: AppContainerProps) => {
  return (
    <div className="app-container">
      <Header query={query} onInputChange={onInputChange} onSearch={onSearch} />
      <ResultsContainer results={results} loading={loading} />
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    </div>
  );
};

export default AppContainer;
