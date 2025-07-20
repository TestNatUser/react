// Mock fetch function
export const mockFetch = jest.fn();

// Setup global fetch mock
export const setupFetchMock = () => {
  global.fetch = mockFetch;
};

// API response helpers
export const mockApiSuccess = (seasons: any) => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({
      seasons,
      page: {
        pageNumber: 1,
        pageSize: 10,
        numberOfElements: seasons.length,
        totalElements: seasons.length,
        totalPages: 1
      }
    }),
  });
};

export const mockApiError = (status: number = 500, message: string = 'Server Error') => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    statusText: message,
    json: async () => ({ error: message }),
  });
};

export const mockApiNetworkError = () => {
  mockFetch.mockRejectedValueOnce(new Error('Network Error'));
};

// Reset fetch mock
export const resetFetchMock = () => {
  mockFetch.mockReset();
}; 