/**
 * API Configuration
 * Controls whether to attempt real API calls or use mock data directly
 */

// Use real API for application, mock data for tests
export const USE_REAL_API = process.env.NODE_ENV === 'test' ? false : true;

// API endpoint configuration
export const API_CONFIG = {
  baseUrl: 'https://stapi.co/api/v1/rest/season/search',
  timeout: 5000,
  maxRetries: 1,
  retryDelay: 500,
} as const;

/**
 * Check if we should attempt API calls based on environment and configuration
 */
export function shouldUseRealApi(): boolean {
  // In test mode, use mock data (tests use mocked fetch anyway)
  if (process.env.NODE_ENV === 'test') {
    return false;
  }

  // In development and production, use real API
  return true;
}
