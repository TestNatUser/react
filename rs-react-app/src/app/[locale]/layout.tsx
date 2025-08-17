import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { locales } from '../../i18n';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return children;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}