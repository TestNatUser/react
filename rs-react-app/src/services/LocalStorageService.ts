/**
 * LocalStorageService - Handles localStorage operations for the application
 */
const SEARCH_TERM_KEY = 'season-search-term';

/**
 * Save search term to localStorage
 */
function saveSearchTerm(searchTerm: string): void {
  try {
    if (searchTerm.trim()) {
      localStorage.setItem(SEARCH_TERM_KEY, searchTerm.trim());
    }
  } catch (error) {
    console.warn('Failed to save search term to localStorage:', error);
  }
}

/**
 * Get saved search term from localStorage
 */
function getSavedSearchTerm(): string {
  try {
    return localStorage.getItem(SEARCH_TERM_KEY) || '';
  } catch (error) {
    console.warn('Failed to retrieve search term from localStorage:', error);
    return '';
  }
}

/**
 * Clear saved search term from localStorage
 */
function clearSearchTerm(): void {
  try {
    localStorage.removeItem(SEARCH_TERM_KEY);
  } catch (error) {
    console.warn('Failed to clear search term from localStorage:', error);
  }
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export const LocalStorageService = {
  saveSearchTerm,
  getSavedSearchTerm,
  clearSearchTerm,
  isLocalStorageAvailable,
};
