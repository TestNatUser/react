/**
 * Safe date formatting utilities for SSR compatibility
 */

/**
 * Format date string in a consistent way across server and client
 * @param dateString - ISO date string
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Use toISOString to get consistent formatting across server/client
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Failed to format date:', dateString, error);
    return 'Invalid Date';
  }
}

/**
 * Format date string for display with better readability
 * @param dateString - ISO date string
 * @returns Formatted date string in Month DD, YYYY format
 */
export function formatDateForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Use explicit formatting to ensure consistency
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();

    return `${month} ${day}, ${year}`;
  } catch (error) {
    console.warn('Failed to format date for display:', dateString, error);
    return 'Invalid Date';
  }
}
