import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Page Not Found</h2>
      <p className="not-found-message">
        Oops! The page you&apos;re looking for seems to have wandered off into the digital void. 
        Don&apos;t worry, even the best explorers sometimes take a wrong turn.
      </p>
      <Link to="/" className="not-found-button">
        <span className="not-found-icon">🏠</span>
        Take Me Home
      </Link>
    </div>
  );
};

export default NotFound;
