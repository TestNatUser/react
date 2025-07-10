import type { ChangeEvent } from 'react';
import type { SeasonSearchResponse, AppState } from '../interfaces/interface.tsx';

const apiUrl: string = import.meta.env.VITE_URL;

export const handleInputChange = (component: React.Component<{}, AppState>) => (e: ChangeEvent<HTMLInputElement>) => {
  component.setState({ query: e.target.value });
};

export const fetchSeasons = async (
  component: React.Component<{}, AppState>,
  query: string
) => {
  component.setState({ loading: true, error: null, results: [] });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `title=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data: SeasonSearchResponse = await response.json();
    component.setState({ results: data.seasons, loading: false });
  } catch (err) {
    component.setState({ error: 'Failed to fetch data.', loading: false });
  }
};

export const handleSearch = (component: React.Component<{}, AppState>) => () => {
  const { query } = component.state;
  if (query.trim() === '') {
    component.setState({ error: 'Please enter a search term.', results: [] });
    return;
  }
  fetchSeasons(component, query);
};

export const load = (component: React.Component<{}, AppState>) => {
  fetchSeasons(component, component.state.query);
};

export const handleError = (component: React.Component<{}, AppState>) => () => {
  component.setState({ error: 'An error occurred!' });
}; 