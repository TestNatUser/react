import React from 'react';
import { useIntl } from 'react-intl';
import './LanguageSwitcher.css';

import type { SupportedLocale } from '../../contexts/InternationalizationContext';

export interface LanguageSwitcherProps {
  currentLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onLocaleChange,
}) => {
  const intl = useIntl();

  const languages = [
    { code: 'en', name: intl.formatMessage({ id: 'language.en' }) },
    { code: 'es', name: intl.formatMessage({ id: 'language.es' }) },
  ];

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLocaleChange(event.target.value as SupportedLocale);
  };

  return (
    <div className="language-switcher">
      <label htmlFor="language-select" className="language-label">
        {intl.formatMessage({ id: 'language.switcher' })}:
      </label>
      <select
        id="language-select"
        value={currentLocale}
        onChange={handleLanguageChange}
        className="language-select"
        aria-label={intl.formatMessage({ id: 'language.switcher' })}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;