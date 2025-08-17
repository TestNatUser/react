import HomePage from '../../../components/pages/HomePage';

// This catch-all route handles:
// - /[locale]/[page] - for pagination
// - /[locale]/[page]/[detailsId] - for pagination with details
// All logic is handled in the main HomePage component

export default function SlugPage() {
  return <HomePage />;
}
