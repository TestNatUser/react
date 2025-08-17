import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Input from './search/input.tsx';
import Button from './search/button.tsx';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { useLocale } from '../../contexts/InternationalizationContext';
import './header.css';
import type { HeaderProps } from '../../interfaces/interface';

const Header = ({ query, onInputChange, onSearch }: HeaderProps) => {
  const intl = useIntl();
  const { locale, setLocale } = useLocale();

  return (
    <header className="search-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <Link to="/" className="title-link">
              {intl.formatMessage({ id: 'app.title' })}
            </Link>
          </h1>
        </div>

        <div className="header-center">
          <div className="search-controls">
            <Input
              query={query}
              onInputChange={onInputChange}
              onSearch={onSearch}
              placeholder={intl.formatMessage({ id: 'search.placeholder' })}
            />
            <Button onClick={onSearch}>
              {intl.formatMessage({ id: 'search.button' })}
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
