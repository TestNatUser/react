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
  originalRunEndDate?: string;   // ISO date string
  series?: SeriesSummary;
}

export interface SeriesSummary {
  uid: string;
  title: string;
}

export interface Page {
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}

export interface SeasonResponse {
  season: SeasonDetail;
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

export interface HeaderProps {
  query: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export interface AppState {
  query: string;
  results: Season[];
  error: string | null;
  loading: boolean;
}

export interface ResultsContainerProps {
  results: Season[];
  loading: boolean;
}

export interface AppContainerProps {
  query: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  results: Season[];
  loading: boolean;
}