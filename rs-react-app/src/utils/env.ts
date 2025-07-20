/**
 * Utility function to get environment variables
 * This can be easily mocked in tests
 */
export const getEnv = (key: string): string | undefined => {
  return import.meta.env[key];
};

/**
 * Get the API URL from environment variables with fallback
 */
export const getApiUrl = (): string => {
  return getEnv('VITE_URL') || 'https://stapi.co/api/v1/rest/season/search';
};
