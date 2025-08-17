import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from '../locales/en/messages.json';
import esTranslations from '../locales/es/messages.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
};

// Initialize i18n
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    
    interpolation: {
      escapeValue: false, // react already does escaping
    },
    
    // Enable namespaces
    defaultNS: 'translation',
    
    // Debug mode (set to false in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Storage options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;