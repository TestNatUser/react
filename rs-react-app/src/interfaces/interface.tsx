// ===== API & DATA INTERFACES =====

export interface SeasonSearchResponse {
  seasons: Season[];
  page: Page;
}

export interface Season {
  uid: string;
  title: string;
  titleGerman?: string;
  titleItalian?: string;
  titleJapanese?: string;
  titlePolish?: string;
  titleRussian?: string;
  titleSpanish?: string;
  numberOfEpisodes?: number;
  originalRunStartDate?: string; // ISO date string
  originalRunEndDate?: string; // ISO date string
  series?: SeriesSummary;
}

export interface SeasonDetail {
  uid: string;
  title: string;
  titleGerman?: string;
  titleItalian?: string;
  titleJapanese?: string;
  titlePolish?: string;
  titleRussian?: string;
  titleSpanish?: string;
  numberOfEpisodes?: number;
  originalRunStartDate?: string; // ISO 8601 format
  originalRunEndDate?: string;
  series?: SeriesSummary;
  episodes?: EpisodeSummary[];
  productionCompany?: OrganizationSummary;
  originalBroadcaster?: OrganizationSummary;
}

export interface SeasonResponse {
  season: SeasonDetail;
}

export interface SeriesSummary {
  uid: string;
  title: string;
}

export interface EpisodeSummary {
  uid: string;
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  stardateFrom?: number;
  stardateTo?: number;
  yearFrom?: number;
  yearTo?: number;
}

export interface OrganizationSummary {
  uid: string;
  name: string;
}

export interface Page {
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}

// ===== REDUX STATE INTERFACES =====

export interface SeasonsState {
  seasons: Season[];
  loading: boolean;
  error: string | null;
  query: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface SelectedItemsState {
  selectedSeasons: Season[];
  selectionMode: boolean;
  lastSelectedId: string | null;
}

export interface ItemDetailsState {
  selectedItem: SeasonDetail | null;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

export interface AppState {
  query: string;
  results: Season[];
  error: string | null;
  loading: boolean;
}

// ===== THEME INTERFACES =====

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

// ===== COMPONENT PROPS INTERFACES =====

export interface AppContainerProps {
  query: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  results: Season[];
  loading: boolean;
  selectedItems?: Season[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  onItemClick?: (itemId: string) => void;
  isDetailsOpen?: boolean;
}

export interface ResultsContainerProps {
  results: Season[];
  loading: boolean;
  onItemClick?: (itemId: string) => void;
}

export interface HeaderProps {
  query: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export interface SelectionControlsProps {
  availableSeasons: Season[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// ===== UTILITY INTERFACES =====

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export interface DownloadOptions {
  filename: string;
  content: string;
  mimeType?: string;
}

// ===== REDUX STATE INTERFACES =====

export interface SelectedItemsState {
  selectedSeasons: Season[];
  selectionMode: boolean;
  lastSelectedId: string | null;
}

export interface ItemDetailsState {
  selectedItem: SeasonDetail | null;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

export interface SeasonsState {
  seasons: Season[];
  loading: boolean;
  error: string | null;
  query: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ===== THEME INTERFACES =====

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

// ===== COMPONENT PROPS INTERFACES =====

export interface SelectionControlsProps {
  availableSeasons: Season[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// ===== SERVICE INTERFACES =====

export interface ComponentLike {
  state: AppState;
  setState: (newState: Partial<AppState>) => void;
}
