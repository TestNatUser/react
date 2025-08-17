import { Season } from '../interfaces/interface';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stapi.co/api/v1/rest';

/**
 * Server-side function to fetch seasons
 * This runs on the server and provides initial data
 */
export async function getSeasons(
  query: string = '',
  page: number = 1
): Promise<{
  seasons: Season[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}> {
  try {
    const url = new URL(`${API_BASE_URL}/season/search`);

    // Add query parameters
    if (query.trim()) {
      url.searchParams.append('title', query.trim());
    }

    // Pagination parameters
    url.searchParams.append('pageNumber', (page - 1).toString());
    url.searchParams.append('pageSize', '5');

    console.log('Server fetching:', url.toString());

    const response = await fetch(url.toString(), {
      cache: 'force-cache', // Cache the response for static generation
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      seasons: data.seasons || [],
      currentPage: page,
      totalPages: Math.ceil((data.page?.totalElements || 0) / 5),
      totalItems: data.page?.totalElements || 0,
    };
  } catch (error) {
    console.error('Server-side fetch error:', error);

    // Return empty result on error
    return {
      seasons: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    };
  }
}

// Server actions moved to separate file
