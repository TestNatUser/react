import type { ChangeEvent } from 'react';
import type {
  SeasonSearchResponse,
  AppState,
} from '../interfaces/interface';
import { LocalStorageService } from './LocalStorageService';

/**
 * Service class for handling season search operations
 */
export class SeasonService {
  private apiUrl: string;
  private component: React.Component<Record<string, never>, AppState>;

  constructor(component: React.Component<Record<string, never>, AppState>) {
    this.apiUrl = import.meta.env.VITE_URL;
    this.component = component;

    // Bind methods to ensure correct context
    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchSeasons = this.fetchSeasons.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.load = this.load.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Handle input change events
   */
  handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
    this.component.setState({ query: e.target.value });
  }

  /**
   * Fetch seasons from the API
   */
  async fetchSeasons(query: string): Promise<void> {
    this.component.setState({ loading: true, error: null, results: [] });

    try {
      // If query is empty, fetch all results by sending empty title
      const searchQuery = query.trim();
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title=${encodeURIComponent(searchQuery)}`,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: SeasonSearchResponse = await response.json();
      this.component.setState({ results: data.seasons, loading: false });
    } catch {
      this.component.setState({
        error: 'Failed to fetch data.',
        loading: false,
      });
    }
  }

  /**
   * Handle search action
   */
  handleSearch(): void {
    const { query } = this.component.state;
    const searchQuery = query.trim();

    // Save search term to localStorage (save empty string to show all results)
    LocalStorageService.saveSearchTerm(searchQuery);

    this.fetchSeasons(searchQuery);
  }

  /**
   * Load initial data - use saved search term if available, otherwise fetch all results
   */
  load(): void {
    const { query } = this.component.state;
    this.fetchSeasons(query.trim());
  }

  /**
   * Handle error state
   */
  handleError(): void {
    this.component.setState({ error: 'An error occurred!' });
  }

  /**
   * Get the current API URL
   */
  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Update the API URL
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
  }
}

// Factory function to create service instances
export const createSeasonService = (
  component: React.Component<Record<string, never>, AppState>
): SeasonService => {
  return new SeasonService(component);
};

// Legacy exports for backward compatibility
export const handleInputChange =
  (component: React.Component<Record<string, never>, AppState>) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const service = new SeasonService(component);
    service.handleInputChange(e);
  };

export const fetchSeasons = async (
  component: React.Component<Record<string, never>, AppState>,
  query: string
) => {
  const service = new SeasonService(component);
  await service.fetchSeasons(query);
};

export const handleSearch =
  (component: React.Component<Record<string, never>, AppState>) => () => {
    const { query } = component.state;
    const searchQuery = query.trim();

    // Save search term to localStorage (save empty string to show all results)
    LocalStorageService.saveSearchTerm(searchQuery);

    const service = new SeasonService(component);
    service.fetchSeasons(searchQuery);
  };

export const load = (
  component: React.Component<Record<string, never>, AppState>
) => {
  const service = new SeasonService(component);
  // Use saved search term if available, otherwise fetch all results
  const { query } = component.state;
  service.fetchSeasons(query.trim());
};

export const handleError =
  (component: React.Component<Record<string, never>, AppState>) => () => {
    const service = new SeasonService(component);
    service.handleError();
  };
