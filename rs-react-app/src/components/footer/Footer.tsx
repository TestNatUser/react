import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>{t('footer.copyright')}</p>
          <p className="footer-note">
            {t('footer.trademark')}
          </p>
        </div>

        <div className="footer-right">
          <nav className="footer-nav">
            <Link to="/" className="footer-link">
              {t('footer.nav.home')}
            </Link>
            <Link to="/about" className="footer-link">
              {t('footer.nav.about')}
            </Link>
            <a
              href="https://rs.school/react/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {t('footer.nav.rsschool')}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
