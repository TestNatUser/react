import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from './search/input.tsx';
import Button from './search/button.tsx';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { useLocale } from '../../contexts/InternationalizationContext';
import './header.css';
import type { HeaderProps } from '../../interfaces/interface';

const Header = ({ query, onInputChange, onSearch }: HeaderProps) => {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  return (
    <header className="search-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <Link to="/" className="title-link">
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
            <Button onClick={onSearch}>
              {t('search.button')}
            </Button>
          </div>
        </div>

        <div className="header-right">
          <LanguageSwitcher 
            currentLocale={locale} 
            onLocaleChange={setLocale} 
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
