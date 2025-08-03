import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import seasonsReducer from '../store/slices/seasonsSlice';
import selectedItemsReducer from '../store/slices/selectedItemsSlice';
import itemDetailsReducer from '../store/slices/itemDetailsSlice';
import { ThemeProvider } from '../contexts/ThemeContext';

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

// Create a test store for each test
export const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      seasons: seasonsReducer,
      selectedItems: selectedItemsReducer,
      itemDetails: itemDetailsReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }),
  });
};

// Custom render function with providers
const customRender = (
  ui: React.ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    initialEntries = ['/'],
    ...renderOptions
  }: {
    preloadedState?: any;
    store?: ReturnType<typeof createTestStore>;
    initialEntries?: string[];
  } & Omit<RenderOptions, 'wrapper'> = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
