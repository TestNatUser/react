import HomePage from '../../../components/pages/HomePage';
import { locales } from '../../../i18n';

// This catch-all route handles:
// - /[locale]/[page] - for pagination
// - /[locale]/[page]/[detailsId] - for pagination with details
// All logic is handled in the main HomePage component

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string[] }> = [];
  
  locales.forEach((locale) => {
    // Generate common paths
    params.push({ locale, slug: ['1'] }); // pagination page 1
    params.push({ locale, slug: ['2'] }); // pagination page 2
    params.push({ locale, slug: ['3'] }); // pagination page 3
  });
  
  return params;
}

export default function SlugPage() {
  return <HomePage />;
}
