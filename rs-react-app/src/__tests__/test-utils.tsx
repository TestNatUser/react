import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';

// Mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Setup localStorage mock
export const setupLocalStorageMock = () => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
};

// Clear all mocks
export const clearAllMocks = () => {
  jest.clearAllMocks();
  mockLocalStorage.getItem.mockClear();
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.removeItem.mockClear();
  mockLocalStorage.clear.mockClear();
};

// Mock API responses
export const mockApiResponses = {
  successResponse: [
    {
      uid: '1',
      title: 'Test Season 1',
      numberOfEpisodes: 10,
      series: { uid: 'series-1', title: 'Test Series 1' },
    },
    {
      uid: '2',
      title: 'Test Season 2',
      numberOfEpisodes: 12,
      series: { uid: 'series-2', title: 'Test Series 2' },
    },
  ],
  emptyResponse: [],
  errorResponse: new Error('API Error'),
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, options);

export * from '@testing-library/react';
export { customRender as render };
