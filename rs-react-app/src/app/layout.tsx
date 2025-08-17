import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../index.css';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function RootLayout({
  children,
  params: { locale }
}: Props) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Provider store={store}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}