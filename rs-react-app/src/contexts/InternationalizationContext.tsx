import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import i18n from '../i18n/config';

// Define types
export type SupportedLocale = 'en' | 'es';

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  availableLocales: SupportedLocale[];
}

interface InternationalizationProviderProps {
  children: ReactNode;
}

// Create context
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Custom hook to use locale context
export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within an InternationalizationProvider');
  }
  return context;
};

// Storage key for persistence
const LOCALE_STORAGE_KEY = 'star-trek-app-locale';

// Helper function to get initial locale
const getInitialLocale = (): SupportedLocale => {
  // Try to get from localStorage first
  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLocale;
  if (storedLocale && ['en', 'es'].includes(storedLocale)) {
    return storedLocale;
  }

  // Fallback to browser language
  const browserLanguage = navigator.language.split('-')[0] as SupportedLocale;
  if (['en', 'es'].includes(browserLanguage)) {
    return browserLanguage;
  }

  // Default to English
  return 'en';
};

// Provider component
export const InternationalizationProvider: React.FC<InternationalizationProviderProps> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(getInitialLocale);

  // Update locale and persist to localStorage
  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    i18n.changeLanguage(newLocale);
  };

  // Effect to sync with localStorage changes (for multiple tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCALE_STORAGE_KEY && event.newValue) {
        const newLocale = event.newValue as SupportedLocale;
        if (['en', 'es'].includes(newLocale)) {
          setLocaleState(newLocale);
          i18n.changeLanguage(newLocale);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initialize i18n with the current locale
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  const contextValue: LocaleContextType = {
    locale,
    setLocale,
    availableLocales: ['en', 'es'],
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};