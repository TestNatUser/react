import { Component } from 'react';
import type { AppContainerProps } from '../../interfaces/interface.tsx';
import Header from '../header/Header.tsx';
import ErrorButton from '../error/ErrorButton.tsx';
import ResultsContainer from '../main/ResultsContainer.tsx';
import { ErrorBoundary } from '../error/Error.tsx';

/**
 * AppContainer component that provides the main layout structure
 */
class AppContainer extends Component<AppContainerProps> {
  constructor(props: AppContainerProps) {
    super(props);
  }

  render() {
    const { query, onInputChange, onSearch, results, loading } = this.props;

    return (
      <div className="app-container">
        <Header
          query={query}
          onInputChange={onInputChange}
          onSearch={onSearch}
        />
        <ResultsContainer results={results} loading={loading} />
        <ErrorBoundary>
          <ErrorButton />
        </ErrorBoundary>
      </div>
    );
  }
}

export default AppContainer; 