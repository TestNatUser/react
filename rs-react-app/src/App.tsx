import { Component } from 'react';
import type { AppState } from './interfaces/interface.tsx';
import Header from './components/header/header.tsx';
import ErrorButton from './components/error/errorButton.tsx';
import ResultsContainer from './components/main/ResultsContainer.tsx';
import {
  fetchSeasons,
  handleSearch,
  load,
  handleError,
  handleInputChange
} from './services/services.tsx';
import './App.css';
import { ErrorBoundary } from './components/error/error.tsx';

class App extends Component<{}, AppState> {
  state: AppState = {
    query: '',
    results: [],
    error: null,
    loading: false,
  };

  componentDidMount() {
    this.load();
  }

  handleInputChange = handleInputChange(this);
  fetchSeasons = (query: string) => fetchSeasons(this, query);
  handleSearch = handleSearch(this);
  load = () => load(this);
  handleError = handleError(this);

  render() {
    const { query, results, error, loading } = this.state;

    return (
      <div className="app-container">
        <Header
          query={query}
          onInputChange={this.handleInputChange}
          onSearch={this.handleSearch}
        />
        <ResultsContainer results={results} loading={loading} />
        <ErrorBoundary>
          <ErrorButton />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
