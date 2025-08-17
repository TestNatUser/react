import HomePage from '../../components/pages/HomePage';
import { locales } from '../../i18n';

export default function Page() {
  return <HomePage />;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
