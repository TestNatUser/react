import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2024 Star Trek Seasons Explorer</p>
          <p className="footer-note">
            Star Trek is a trademark of CBS Studios Inc.
          </p>
        </div>

        <div className="footer-right">
          <nav className="footer-nav">
            <Link to="/" className="footer-link">
              Home
            </Link>
            <Link to="/about" className="footer-link">
              About
            </Link>
            <a
              href="https://rs.school/react/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              RS School React
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
