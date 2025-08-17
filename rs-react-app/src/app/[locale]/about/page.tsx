import About from '../../../components/pages/About';
import { locales } from '../../../i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function AboutPage() {
  return <About />;
}
