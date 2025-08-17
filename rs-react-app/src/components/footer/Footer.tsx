'use client';

import React from 'react';
import { Link } from '../../lib/navigation';
import { useTranslations } from 'next-intl';
import './Footer.css';

const Footer: React.FC = () => {
  const t = useTranslations();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>{t('footer.copyright')}</p>
          <p className="footer-note">{t('footer.trademark')}</p>
        </div>

        <div className="footer-right">
          <nav className="footer-nav">
            <Link href="/" className="footer-link">
              {t('footer.nav.home')}
            </Link>
            <Link href="/about" className="footer-link">
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
