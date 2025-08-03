import type { ChangeEvent } from 'react';
import type {
  SeasonSearchResponse,
  ComponentLike,
} from '../interfaces/interface';
import { LocalStorageService } from './LocalStorageService';
import { getApiUrl } from '../utils/env';
import { filterMockSeasons } from './mockData';
import { shouldUseRealApi } from './apiConfig';

/**
 * Interface for the minimal component requirements for SeasonService
 */

/**
 * Service class for handling season search operations
 */
export class SeasonService {
  private apiUrl: string;
  private component: ComponentLike;

  constructor(component: ComponentLike) {
    // Use environment variable with fallback to ensure it always works
    this.apiUrl = getApiUrl();
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
   * Fetch seasons from the API with retry logic and fallback
   */
  async fetchSeasons(query: string): Promise<void> {
    this.component.setState({ loading: true, error: null, results: [] });

    // Check if we should use real API or go straight to mock data
    if (!shouldUseRealApi()) {
      // Use mock data directly without API call
      const mockResults = filterMockSeasons(query);
      this.component.setState({
        results: mockResults,
        loading: false,
        error: 'Using sample data for demonstration.',
      });
      return;
    }

    try {
      const searchQuery = query.trim();
      const data = await this.fetchWithRetry(searchQuery);
      this.component.setState({ results: data.seasons, loading: false });
    } catch (error) {
      // Only log in development mode to reduce console noise
      if (process.env.NODE_ENV === 'development') {
        console.info(
          '🔄 API unavailable, using sample data:',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }

      // Fallback to mock data when API is unavailable
      const mockResults = filterMockSeasons(query);
      this.component.setState({
        results: mockResults,
        loading: false,
        error: 'API temporarily unavailable. Showing sample data.',
      });
    }
  }

  /**
   * Fetch with retry logic and better error handling
   */
  private async fetchWithRetry(
    searchQuery: string,
    maxRetries = 1
  ): Promise<SeasonSearchResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced to 5 second timeout

        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `title=${encodeURIComponent(searchQuery)}`,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data: SeasonSearchResponse = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors - fail fast
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('API timeout');
          }
          if (error.message.includes('CORS')) {
            throw new Error('API access blocked');
          }
          if (error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            throw new Error('API overloaded');
          }
          if (error.message.includes('Failed to fetch')) {
            throw new Error('API unavailable');
          }
        }

        // Only retry once with shorter delay
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    throw lastError || new Error('API connection failed');
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
  component: ComponentLike
): SeasonService => {
  return new SeasonService(component);
};

// Legacy exports for backward compatibility
export const handleInputChange =
  (component: ComponentLike) => (e: ChangeEvent<HTMLInputElement>) => {
    const service = new SeasonService(component);
    service.handleInputChange(e);
  };

export const fetchSeasons = async (component: ComponentLike, query: string) => {
  const service = new SeasonService(component);
  await service.fetchSeasons(query);
};

export const handleSearch = (component: ComponentLike) => () => {
  const { query } = component.state;
  const searchQuery = query.trim();

  // Save search term to localStorage (save empty string to show all results)
  LocalStorageService.saveSearchTerm(searchQuery);

  const service = new SeasonService(component);
  service.fetchSeasons(searchQuery);
};

export const load = (component: ComponentLike) => {
  const service = new SeasonService(component);
  // Use saved search term if available, otherwise fetch all results
  const { query } = component.state;
  service.fetchSeasons(query.trim());
};

export const handleError = (component: ComponentLike) => () => {
  const service = new SeasonService(component);
  service.handleError();
};
