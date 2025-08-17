import { Season } from '../interfaces/interface';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stapi.co/api/v1/rest';

/**
 * Client-side function to generate CSV data
 * This runs on the client and fetches data via API
 */
export async function generateCSV(seasonIds: string[]): Promise<string> {
  try {
    // Fetch season details for selected seasons
    const seasons: Season[] = [];

    for (const id of seasonIds) {
      try {
        const response = await fetch(`${API_BASE_URL}/season?uid=${id}`, {
          cache: 'force-cache',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.season) {
            seasons.push(data.season);
          }
        }
      } catch (error) {
        console.error(`Error fetching season ${id}:`, error);
      }
    }

    // Generate CSV content
    const headers = [
      'Title',
      'Series',
      'Season Number',
      'Number of Episodes',
      'Start Date',
      'End Date',
      'Details URL',
      'UID',
    ];

    const csvRows = seasons.map((season) => [
      season.title || '',
      season.series?.title || '',
      '', // Season number not available in Season interface
      season.numberOfEpisodes?.toString() || '',
      season.originalRunStartDate || '',
      season.originalRunEndDate || '',
      season.uid ? `https://stapi.co/season/${season.uid}` : '',
      season.uid || '',
    ]);

    // Escape CSV values
    const escapeCsvValue = (value: string): string => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.join(','),
      ...csvRows.map((row) => row.map(escapeCsvValue).join(',')),
    ].join('\n');

    return csvContent;
  } catch (error) {
    console.error('CSV generation error:', error);
    throw new Error('Failed to generate CSV');
  }
}
