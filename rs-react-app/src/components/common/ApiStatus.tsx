import './ApiStatus.css';

interface ApiStatusProps {
  error: string | null;
}

const ApiStatus = ({ error }: ApiStatusProps) => {
  if (!error) {
    return null;
  }

  const isApiError = error.includes('API temporarily unavailable');
  const isMockMode = error.includes('Using sample data for demonstration');

  if (!isApiError && !isMockMode) {
    return null;
  }

  return (
    <div className="api-status-banner">
      <div className="api-status-content">
        <span className="api-status-icon">{isMockMode ? '🚀' : '⚠️'}</span>
        <div className="api-status-text">
          <strong>{isMockMode ? 'Demo Mode:' : 'Notice:'}</strong>{' '}
          {isMockMode
            ? 'Showing sample Star Trek season data for demonstration purposes.'
            : 'The Star Trek API is temporarily unavailable. Showing sample data for demonstration purposes.'}
        </div>
        {isApiError && (
          <button
            className="api-status-close"
            onClick={() => window.location.reload()}
            title="Retry connection"
          >
            🔄
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiStatus;
