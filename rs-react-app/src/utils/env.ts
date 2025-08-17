/**
 * Utility function to get environment variables
 * This can be easily mocked in tests
 */
export const getEnv = (key: string): string | undefined => {
  // In Next.js, use process.env for server-side and client-side env vars
  if (typeof window === 'undefined') {
    // Server-side
    return process.env[key];
  } else {
    // Client-side - Next.js exposes public env vars with NEXT_PUBLIC_ prefix
    return process.env[key];
  }
};

/**
 * Get the API URL from environment variables with fallback
 */
export const getApiUrl = (): string => {
  return getEnv('VITE_URL') || 'https://stapi.co/api/v1/rest/season/search';
};
