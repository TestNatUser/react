import { locales } from '../../../i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>
        This is a simple test page to check if the basic Next.js structure
        works.
      </p>
    </div>
  );
}
