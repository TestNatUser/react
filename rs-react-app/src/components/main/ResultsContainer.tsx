import { Component } from 'react';
import type { ResultsContainerProps } from '../../interfaces/interface';
import Loader from '../loader/Loader.tsx';
import ResultsHeader from '../main/ResultsHeader';

class ResultsContainer extends Component<ResultsContainerProps> {
  render() {
    const { results, loading } = this.props;
    const safeResults = results || [];
    return (
      <div className="results-container">
        <ResultsHeader />
        {loading && <Loader />}
        {!loading && safeResults.length === 0 && <div>No results.</div>}
        {safeResults.filter(season => season && season.uid).map((season) => (
          <div key={season.uid} style={{ marginBottom: 6 }}>
            <span className="item-name">{season.title}</span>
            <span>
              Episodes: {season.numberOfEpisodes ?? 'N/A'}, Series Title:{' '}
              {season.series?.title ?? 'N/A'}
            </span>
          </div>
        ))}
      </div>
    );
  }
}

export default ResultsContainer;
