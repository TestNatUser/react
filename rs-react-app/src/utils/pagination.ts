// Pagination utilities for handling paginated data

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Calculate pagination information
 */
export function calculatePagination(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationInfo {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
  };
}

/**
 * Get paginated items from an array
 */
export function getPaginatedItems<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): { paginatedItems: T[]; paginationInfo: PaginationInfo } {
  const paginationInfo = calculatePagination(items.length, currentPage, itemsPerPage);
  const paginatedItems = items.slice(paginationInfo.startIndex, paginationInfo.endIndex);

  return {
    paginatedItems,
    paginationInfo,
  };
}

/**
 * Get page number from URL search params
 */
export function getPageFromUrl(searchParams: URLSearchParams): number {
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  return isNaN(page) || page < 1 ? 1 : page;
}

/**
 * Update URL with page parameter
 */
export function updateUrlWithPage(
  page: number,
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void
): void {
  const newParams = new URLSearchParams(searchParams);
  
  if (page <= 1) {
    newParams.delete('page');
  } else {
    newParams.set('page', page.toString());
  }
  
  setSearchParams(newParams);
}

/**
 * Update URL with details parameter
 */
export function updateUrlWithDetails(
  detailsId: string | null,
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void
): void {
  const newParams = new URLSearchParams(searchParams);
  
  if (detailsId) {
    newParams.set('details', detailsId);
  } else {
    newParams.delete('details');
  }
  
  setSearchParams(newParams);
}

/**
 * Get details ID from URL search params
 */
export function getDetailsFromUrl(searchParams: URLSearchParams): string | null {
  return searchParams.get('details');
}