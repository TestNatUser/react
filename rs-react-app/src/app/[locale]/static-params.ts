import { locales } from '../../i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
