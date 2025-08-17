'use client';

import React from 'react';
import { useRouter, usePathname } from '../../lib/navigation';
import { useTranslations, useLocale } from 'next-intl';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: t('language.en') },
    { code: 'es', name: t('language.es') },
  ];

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLocale = event.target.value;

    // next-intl navigation handles locale switching automatically
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="language-switcher">
      <label htmlFor="language-select" className="language-label">
        {t('language.switcher')}:
      </label>
      <select
        id="language-select"
        value={locale}
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
