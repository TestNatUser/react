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

export interface AppContainerProps {
  seasons: Season[];
  loading: boolean;
  query: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  onItemClick?: (itemId: string, seasonData?: Season) => void;
  isDetailsOpen?: boolean;
  results: Season[];
  selectedItems: Season[];
}

export interface ResultsContainerProps {
  results: Season[];
  loading: boolean;
  onItemClick?: (itemId: string, seasonData?: Season) => void;
}

export interface HeaderProps {
  query: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export interface SelectionControlsProps {
  availableSeasons: Season[];
}

export interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export interface AppState {
  results: Season[];
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

// ===== COMMON INTERFACES =====

export interface Season {
  uid: string;
  title: string;
  numberOfEpisodes?: number;
  originalRunStartDate?: string;
  originalRunEndDate?: string;
  series?: {
    uid: string;
    title: string;
  };
  episodes?: Episode[];
  productionCompany?: {
    uid: string;
    name: string;
  };
  originalBroadcaster?: {
    uid: string;
    name: string;
  };
}

export interface Episode {
  uid: string;
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface SeasonDetail extends Season {
  episodes?: Episode[];
  productionCompany?: {
    uid: string;
    name: string;
  };
  originalBroadcaster?: {
    uid: string;
    name: string;
  };
  titleGerman?: string;
  titleItalian?: string;
  titleJapanese?: string;
  titlePolish?: string;
  titleRussian?: string;
  titleSpanish?: string;
}

export interface SeasonSearchResponse {
  seasons: Season[];
  page: {
    pageNumber: number;
    pageSize: number;
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    firstPage: boolean;
    lastPage: boolean;
  };
}

export interface ComponentLike {
  fetchSeasons: (
    query: string,
    setResults: (results: Season[]) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
  ) => void;
  setState: (state: Record<string, unknown>) => void;
  state: Record<string, unknown>;
}

export interface SearchEvent {
  preventDefault(): void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export interface InputProps {
  placeholder?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  onSearch: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export interface DownloadOptions {
  filename: string;
  data: unknown[];
  content?: string;
  mimeType?: string;
}
