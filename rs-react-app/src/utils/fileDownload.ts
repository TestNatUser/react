/**
 * File download utility that avoids direct DOM manipulation in React components
 */
import type { DownloadOptions } from '../interfaces/interface';

/**
 * Downloads content as a file using the browser's download API
 * This approach creates a temporary blob URL and triggers download without direct DOM manipulation
 */
export const downloadFile = ({
  filename,
  content,
  mimeType = 'text/plain',
}: DownloadOptions): void => {
  try {
    // Create blob with the content
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });

    // Create object URL
    const url = URL.createObjectURL(blob);

    // Use the modern approach with a temporary anchor
    const anchor = Object.assign(document.createElement('a'), {
      href: url,
      download: filename,
      style: 'display: none',
    });

    // Trigger download
    anchor.click();

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    // Fallback: open in new window
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  }
};

/**
 * Converts array of objects to CSV format
 */
export const arrayToCsv = <T extends Record<string, unknown>>(
  data: T[],
  headers: string[]
): string => {
  if (data.length === 0) return '';

  const csvRows = [
    headers.join(','),
    ...data.map((item) =>
      headers
        .map((header) => {
          const value = item[header.toLowerCase().replace(/\s+/g, '')] || '';
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    ),
  ];

  return csvRows.join('\n');
};
