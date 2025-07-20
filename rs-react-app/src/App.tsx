import { Component } from 'react';
import type { AppState } from './interfaces/interface';
import AppContainer from './components/layout/AppContainer.tsx';
import {
  fetchSeasons,
  handleSearch,
  load,
  handleError,
  handleInputChange,
} from './services/services';
import { LocalStorageService } from './services/LocalStorageService';
import './App.css';

class App extends Component<Record<string, never>, AppState> {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchSeasons: (query: string) => Promise<void>;
  handleSearch: () => void;
  load: () => void;
  handleError: () => void;

  constructor(props: Record<string, never>) {
    super(props);
    const savedSearchTerm = LocalStorageService.getSavedSearchTerm();
    this.state = {
      query: savedSearchTerm,
      results: [],
      error: null,
      loading: false,
    };

    // Bind methods
    this.handleInputChange = handleInputChange(this);
    this.fetchSeasons = (query: string) => fetchSeasons(this, query);
    this.handleSearch = handleSearch(this);
    this.load = () => load(this);
    this.handleError = handleError(this);
  }

  componentDidMount() {
    this.load();
  }

  render() {
    const { query, results, loading } = this.state;

    return (
      <AppContainer
        query={query}
        onInputChange={this.handleInputChange}
        onSearch={this.handleSearch}
        results={results}
        loading={loading}
      />
    );
  }
}

export default App;
