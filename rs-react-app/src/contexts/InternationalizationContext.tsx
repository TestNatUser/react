import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

// Import locale data
import enMessages from '../locales/en/messages.json';
import esMessages from '../locales/es/messages.json';

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

// Messages object
const messages = {
  en: enMessages,
  es: esMessages,
};

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
  };

  // Effect to sync with localStorage changes (for multiple tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCALE_STORAGE_KEY && event.newValue) {
        const newLocale = event.newValue as SupportedLocale;
        if (['en', 'es'].includes(newLocale)) {
          setLocaleState(newLocale);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const contextValue: LocaleContextType = {
    locale,
    setLocale,
    availableLocales: ['en', 'es'],
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale="en"
        onError={(error) => {
          console.warn('React Intl Error:', error);
        }}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};