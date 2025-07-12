/**
 * LocalStorageService - Handles localStorage operations for the application
 */
export class LocalStorageService {
  private static readonly SEARCH_TERM_KEY = 'season-search-term';

  /**
   * Save search term to localStorage
   */
  static saveSearchTerm(searchTerm: string): void {
    try {
      if (searchTerm.trim()) {
        localStorage.setItem(this.SEARCH_TERM_KEY, searchTerm.trim());
      }
    } catch (error) {
      console.warn('Failed to save search term to localStorage:', error);
    }
  }

  /**
   * Get saved search term from localStorage
   */
  static getSavedSearchTerm(): string {
    try {
      return localStorage.getItem(this.SEARCH_TERM_KEY) || '';
    } catch (error) {
      console.warn('Failed to retrieve search term from localStorage:', error);
      return '';
    }
  }

  /**
   * Clear saved search term from localStorage
   */
  static clearSearchTerm(): void {
    try {
      localStorage.removeItem(this.SEARCH_TERM_KEY);
    } catch (error) {
      console.warn('Failed to clear search term from localStorage:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  static isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
} 