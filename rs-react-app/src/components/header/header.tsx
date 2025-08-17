'use client';

import { Link } from '../../lib/navigation';
import { useTranslations } from 'next-intl';
import Input from './search/input';
import Button from './search/button';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import './header.css';
import type { HeaderProps } from '../../interfaces/interface';

const Header = ({ query, onInputChange, onSearch }: HeaderProps) => {
  const t = useTranslations();

  return (
    <header className="search-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <Link href="/" className="title-link">
              {t('app.title')}
            </Link>
          </h1>
        </div>

        <div className="header-center">
          <div className="search-controls">
            <Input
              query={query}
              onInputChange={onInputChange}
              onSearch={onSearch}
              placeholder={t('search.placeholder')}
            />
            <Button onClick={onSearch}>{t('search.button')}</Button>
          </div>
        </div>

        <div className="header-right">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
