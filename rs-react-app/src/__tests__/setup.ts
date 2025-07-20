import { setupLocalStorageMock } from './test-utils';
import { setupFetchMock } from './mocks/api';

// Setup global mocks
setupLocalStorageMock();
setupFetchMock();

// Mock the environment utility
jest.mock('../utils/env', () => ({
  getEnv: jest.fn((key: string) => {
    if (key === 'VITE_URL') {
      return 'https://stapi.co/api/v1/rest/season/search';
    }
    return undefined;
  }),
  getApiUrl: jest.fn(() => 'https://stapi.co/api/v1/rest/season/search')
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
}; 