'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { locales } from '../../i18n';

// Import messages dynamically
import enMessages from '../../locales/en/messages.json';
import esMessages from '../../locales/es/messages.json';

type Props = {
  children: ReactNode;
};

const messages = {
  en: enMessages,
  es: esMessages,
};

export default function LocaleLayout({ children }: Props) {
  const params = useParams();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const currentLocale = Array.isArray(params.locale)
      ? params.locale[0]
      : params.locale;
    if (
      currentLocale &&
      locales.includes(currentLocale as (typeof locales)[number])
    ) {
      setLocale(currentLocale);
    }
  }, [params.locale]);

  return (
    <NextIntlClientProvider
      messages={messages[locale as keyof typeof messages]}
      locale={locale}
    >
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    </NextIntlClientProvider>
  );
}

// generateStaticParams moved to page.tsx to avoid client/server conflict
