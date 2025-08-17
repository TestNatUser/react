import { locales } from '../../i18n';
import ClientPage from './ClientPage';

export default function Page() {
  return <ClientPage />;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
