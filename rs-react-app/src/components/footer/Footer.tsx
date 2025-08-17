import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import './Footer.css';

const Footer: React.FC = () => {
  const intl = useIntl();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>{intl.formatMessage({ id: 'footer.copyright' })}</p>
          <p className="footer-note">
            {intl.formatMessage({ id: 'footer.trademark' })}
          </p>
        </div>

        <div className="footer-right">
          <nav className="footer-nav">
            <Link to="/" className="footer-link">
              {intl.formatMessage({ id: 'footer.nav.home' })}
            </Link>
            <Link to="/about" className="footer-link">
              {intl.formatMessage({ id: 'footer.nav.about' })}
            </Link>
            <a
              href="https://rs.school/react/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {intl.formatMessage({ id: 'footer.nav.rsschool' })}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
