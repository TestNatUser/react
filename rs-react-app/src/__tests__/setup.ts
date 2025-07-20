import { setupLocalStorageMock } from './test-utils';
import { setupFetchMock } from './mocks/api';

// Setup global mocks
setupLocalStorageMock();
setupFetchMock();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
}; 