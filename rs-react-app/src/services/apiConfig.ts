/**
 * API Configuration
 * Controls whether to attempt real API calls or use mock data directly
 */

// Set to false to skip API calls entirely and use mock data
export const USE_REAL_API = process.env.NODE_ENV === 'test' ? true : false;

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
  // In test mode, always use real API (with mocked fetch)
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  // In development, respect the USE_REAL_API flag
  if (process.env.NODE_ENV === 'development') {
    return USE_REAL_API;
  }

  // In production, you might want different logic
  return USE_REAL_API;
}
