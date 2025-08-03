import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
      <h2 style={{ margin: 0 }}>Page Not Found</h2>
      <p style={{ margin: 0, color: '#666' }}>
        The page you are looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '1rem',
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
