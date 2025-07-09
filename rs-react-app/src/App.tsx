import { Component, type ChangeEvent } from 'react';
import type { Season, SeasonSearchResponse } from './interfaces/interface.tsx';
import Button from './components/header/search/button.tsx';
import Loader from './components/loader/loader.tsx';
import Header from './components/header/header.tsx';
import './App.css';

interface AppState {
  query: string;
  results: Season[];
  error: string | null;
  loading: boolean;
}

const apiUrl:string = import.meta.env.VITE_URL; 

class App extends Component<{}, AppState> {
  state: AppState = {
    query: '', 
    results: [],
    error: null,
    loading: false,
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value });
  };

  handleSearch = async () => {
    const { query } = this.state;
    if (query.trim() === '') {
      this.setState({ error: 'Please enter a search term.', results: [] });
      return;
    }

    this.setState({ loading: true, error: null, results: [] });

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: SeasonSearchResponse = await response.json();
      this.setState({ results: data.seasons, loading: false });
    } catch (err) {
      this.setState({ error: 'Failed to fetch data.', loading: false });
    }
  };

  handleError = () => {
    this.setState({ error: 'An error occurred!' });
  };

  render() {
    const { query, results, error, loading } = this.state;

    return (
      <div className="app-container">
        <Header
          query={query}
          onInputChange={this.handleInputChange}
          onSearch={this.handleSearch}
        />

        {/* Results */}
        <div className="results-container">
          <div className="results-header">
            <span className="item-name">Item Name</span>
            <span>Item Description</span>
          </div>
          {loading && <Loader />}
          {!loading && results.length === 0 && <div>No results.</div>}
          {results.map((season) => (
            <div key={season.uid} style={{ marginBottom: 6 }}>
              <span className="item-name">{season.title}</span>
              <span>
                Episodes: {season.numberOfEpisodes ?? 'N/A'}, Run: {season.originalRunStartDate ?? 'N/A'} - {season.originalRunEndDate ?? 'N/A'}
              </span>
            </div>
          ))}
        </div>
        <Button onClick={this.handleError} className='error-btn'>Error button</Button>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }
}

export default App;