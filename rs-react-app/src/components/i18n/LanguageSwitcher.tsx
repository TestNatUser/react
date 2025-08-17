import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: t('language.en') },
    { code: 'es', name: t('language.es') },
  ];

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLocaleChange(event.target.value as SupportedLocale);
  };

  return (
    <div className="language-switcher">
      <label htmlFor="language-select" className="language-label">
        {t('language.switcher')}:
      </label>
      <select
        id="language-select"
        value={currentLocale}
        onChange={handleLanguageChange}
        className="language-select"
        aria-label={t('language.switcher')}
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