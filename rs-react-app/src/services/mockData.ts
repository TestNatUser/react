import type { Season } from '../interfaces/interface';

/**
 * Mock data for when the API is unavailable
 * This provides fallback data to ensure the app remains functional
 */
export const mockSeasons: Season[] = [
  {
    uid: 'mock-1',
    title: 'Star Trek: The Original Series - Season 1',
    numberOfEpisodes: 29,
    originalRunStartDate: '1966-09-08',
    originalRunEndDate: '1967-04-13',
    series: {
      uid: 'tos',
      title: 'Star Trek: The Original Series',
    },
  },
  {
    uid: 'mock-2',
    title: 'Star Trek: The Next Generation - Season 1',
    numberOfEpisodes: 26,
    originalRunStartDate: '1987-09-28',
    originalRunEndDate: '1988-05-16',
    series: {
      uid: 'tng',
      title: 'Star Trek: The Next Generation',
    },
  },
  {
    uid: 'mock-3',
    title: 'Star Trek: Deep Space Nine - Season 1',
    numberOfEpisodes: 20,
    originalRunStartDate: '1993-01-03',
    originalRunEndDate: '1993-06-20',
    series: {
      uid: 'ds9',
      title: 'Star Trek: Deep Space Nine',
    },
  },
  {
    uid: 'mock-4',
    title: 'Star Trek: Voyager - Season 1',
    numberOfEpisodes: 16,
    originalRunStartDate: '1995-01-16',
    originalRunEndDate: '1995-05-22',
    series: {
      uid: 'voy',
      title: 'Star Trek: Voyager',
    },
  },
  {
    uid: 'mock-5',
    title: 'Star Trek: Enterprise - Season 1',
    numberOfEpisodes: 26,
    originalRunStartDate: '2001-09-26',
    originalRunEndDate: '2002-05-22',
    series: {
      uid: 'ent',
      title: 'Star Trek: Enterprise',
    },
  },
  {
    uid: 'mock-6',
    title: 'Star Trek: Discovery - Season 1',
    numberOfEpisodes: 15,
    originalRunStartDate: '2017-09-24',
    originalRunEndDate: '2018-02-11',
    series: {
      uid: 'dis',
      title: 'Star Trek: Discovery',
    },
  },
  {
    uid: 'mock-7',
    title: 'Star Trek: Strange New Worlds - Season 1',
    numberOfEpisodes: 10,
    originalRunStartDate: '2022-05-05',
    originalRunEndDate: '2022-07-07',
    series: {
      uid: 'snw',
      title: 'Star Trek: Strange New Worlds',
    },
  },
];

/**
 * Filter mock seasons based on search query
 */
export function filterMockSeasons(query: string): Season[] {
  if (!query.trim()) {
    return mockSeasons;
  }

  const searchTerm = query.toLowerCase().trim();
  return mockSeasons.filter(
    (season) =>
      season.title?.toLowerCase().includes(searchTerm) ||
      season.series?.title?.toLowerCase().includes(searchTerm)
  );
}
