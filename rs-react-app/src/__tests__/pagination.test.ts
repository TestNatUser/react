import {
  calculatePagination,
  getPaginatedItems,
  getPageFromUrl,
  updateUrlWithPage,
  updateUrlWithDetails,
  getDetailsFromUrl,
} from '../utils/pagination';

describe('pagination utilities', () => {
  describe('calculatePagination', () => {
    test('should calculate pagination correctly', () => {
      const result = calculatePagination(25, 2, 5);
      expect(result).toEqual({
        currentPage: 2,
        totalPages: 5,
        totalItems: 25,
        itemsPerPage: 5,
        startIndex: 5,
        endIndex: 10,
      });
    });

    test('should handle edge cases', () => {
      const result = calculatePagination(0, 1, 5);
      expect(result.totalPages).toBe(0);
      expect(result.startIndex).toBe(0);
      expect(result.endIndex).toBe(0);
    });

    test('should clamp page to valid range', () => {
      const result = calculatePagination(10, 10, 5);
      expect(result.currentPage).toBe(2); // Should clamp to max page
    });

    test('should handle minimum page', () => {
      const result = calculatePagination(10, 0, 5);
      expect(result.currentPage).toBe(1); // Should clamp to minimum page
    });
  });

  describe('getPaginatedItems', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    test('should return correct items for page', () => {
      const result = getPaginatedItems(items, 2, 3);
      expect(result.paginatedItems).toEqual(['d', 'e', 'f']);
      expect(result.paginationInfo.currentPage).toBe(2);
    });

    test('should handle last page with fewer items', () => {
      const result = getPaginatedItems(items, 3, 3);
      expect(result.paginatedItems).toEqual(['g', 'h']);
    });

    test('should handle empty array', () => {
      const result = getPaginatedItems([], 1, 5);
      expect(result.paginatedItems).toEqual([]);
      expect(result.paginationInfo.totalPages).toBe(0);
    });
  });

  describe('URL utilities', () => {
    test('getPageFromUrl should parse page correctly', () => {
      const params = new URLSearchParams('page=3');
      expect(getPageFromUrl(params)).toBe(3);
    });

    test('getPageFromUrl should default to 1', () => {
      const params = new URLSearchParams('');
      expect(getPageFromUrl(params)).toBe(1);
    });

    test('getPageFromUrl should handle invalid page', () => {
      const params = new URLSearchParams('page=invalid');
      expect(getPageFromUrl(params)).toBe(1);
    });

    test('updateUrlWithPage should set page parameter', () => {
      const params = new URLSearchParams();
      const setParams = jest.fn();

      updateUrlWithPage(3, params, setParams);

      expect(setParams).toHaveBeenCalledWith(
        expect.objectContaining({
          toString: expect.any(Function),
        })
      );
    });

    test('updateUrlWithPage should remove page parameter for page 1', () => {
      const params = new URLSearchParams('page=3');
      const setParams = jest.fn();

      updateUrlWithPage(1, params, setParams);

      expect(setParams).toHaveBeenCalled();
    });

    test('getDetailsFromUrl should return details ID', () => {
      const params = new URLSearchParams('details=season-1');
      expect(getDetailsFromUrl(params)).toBe('season-1');
    });

    test('getDetailsFromUrl should return null when not present', () => {
      const params = new URLSearchParams('');
      expect(getDetailsFromUrl(params)).toBeNull();
    });

    test('updateUrlWithDetails should set details parameter', () => {
      const params = new URLSearchParams();
      const setParams = jest.fn();

      updateUrlWithDetails('season-1', params, setParams);

      expect(setParams).toHaveBeenCalled();
    });

    test('updateUrlWithDetails should remove details parameter when null', () => {
      const params = new URLSearchParams('details=season-1');
      const setParams = jest.fn();

      updateUrlWithDetails(null, params, setParams);

      expect(setParams).toHaveBeenCalled();
    });
  });
});
