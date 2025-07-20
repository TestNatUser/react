import { LocalStorageService } from '../services/LocalStorageService';
import { clearAllMocks, mockLocalStorage, setupLocalStorageMock } from '../__tests__/test-utils';

describe('LocalStorageService', () => {
  beforeEach(() => {
    setupLocalStorageMock();
    clearAllMocks();
  });

  describe('getSavedSearchTerm', () => {
    test('returns saved search term when exists', () => {
      mockLocalStorage.getItem.mockReturnValue('test search term');
      
      const result = LocalStorageService.getSavedSearchTerm();
      
      expect(result).toBe('test search term');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('season-search-term');
    });

    test('returns empty string when no saved term exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = LocalStorageService.getSavedSearchTerm();
      
      expect(result).toBe('');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('season-search-term');
    });

    test('returns empty string when localStorage throws error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const result = LocalStorageService.getSavedSearchTerm();
      
      expect(result).toBe('');
    });

    test('handles undefined return from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(undefined);
      
      const result = LocalStorageService.getSavedSearchTerm();
      
      expect(result).toBe('');
    });
  });

  describe('saveSearchTerm', () => {
    test('saves search term to localStorage', () => {
      const searchTerm = 'new search term';
      
      LocalStorageService.saveSearchTerm(searchTerm);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', searchTerm);
    });

    test('saves empty string correctly', () => {
      LocalStorageService.saveSearchTerm('');
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', '');
    });

    test('saves search term with special characters', () => {
      const specialTerm = '!@#$%^&*()[]{}|\\:";\'<>?,./~`';
      
      LocalStorageService.saveSearchTerm(specialTerm);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', specialTerm);
    });

    test('saves search term with unicode characters', () => {
      const unicodeTerm = '测试 🔍 término';
      
      LocalStorageService.saveSearchTerm(unicodeTerm);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', unicodeTerm);
    });

    test('handles localStorage error gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      expect(() => {
        LocalStorageService.saveSearchTerm('test');
      }).not.toThrow();
    });

    test('trims whitespace from search term before saving', () => {
      const termWithWhitespace = '  test search term  ';
      
      LocalStorageService.saveSearchTerm(termWithWhitespace);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', 'test search term');
    });

    test('handles very long search terms', () => {
      const longTerm = 'a'.repeat(1000);
      
      LocalStorageService.saveSearchTerm(longTerm);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', longTerm);
    });
  });

  describe('Error Handling', () => {
    test('handles localStorage not available', () => {
      // Simulate localStorage not being available
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });
      
      expect(() => {
        LocalStorageService.getSavedSearchTerm();
      }).not.toThrow();
      
      expect(() => {
        LocalStorageService.saveSearchTerm('test');
      }).not.toThrow();
    });

    test('handles localStorage quota exceeded', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      
      expect(() => {
        LocalStorageService.saveSearchTerm('test');
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    test('save and retrieve workflow', () => {
      const searchTerm = 'integration test term';
      
      // Save term
      LocalStorageService.saveSearchTerm(searchTerm);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', searchTerm);
      
      // Mock retrieval
      mockLocalStorage.getItem.mockReturnValue(searchTerm);
      
      // Retrieve term
      const retrieved = LocalStorageService.getSavedSearchTerm();
      expect(retrieved).toBe(searchTerm);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('season-search-term');
    });

    test('overwrite existing search term', () => {
      // Save first term
      LocalStorageService.saveSearchTerm('first term');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', 'first term');
      
      // Save second term (should overwrite)
      LocalStorageService.saveSearchTerm('second term');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('season-search-term', 'second term');
      
      // Should have been called twice total
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance Tests', () => {
    test('handles multiple rapid save operations', () => {
      const terms = ['term1', 'term2', 'term3', 'term4', 'term5'];
      
      const start = performance.now();
      terms.forEach(term => {
        LocalStorageService.saveSearchTerm(term);
      });
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // Should complete quickly
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(5);
    });

    test('handles multiple rapid get operations', () => {
      mockLocalStorage.getItem.mockReturnValue('test term');
      
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        LocalStorageService.getSavedSearchTerm();
      }
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // Should complete quickly
      expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(100);
    });
  });
}); 