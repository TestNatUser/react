import { ReactNode } from 'react';
import { getSeasons } from '../../lib/serverActions';

type Props = {
  children: ReactNode;
  searchParams?: {
    q?: string;
    page?: string;
  };
};

/**
 * Server Component that fetches initial data
 * This runs on the server and provides SSR data
 */
export default async function ServerDataProvider({
  children,
  searchParams,
}: Props) {
  const query = searchParams?.q || '';
  const page = parseInt(searchParams?.page || '1', 10);

  // Fetch initial data on the server
  const initialData = await getSeasons(query, page);

  // Pass data to client components via context or props
  // For now, we'll inject it into the global scope for client components to pick up
  const dataScript = `
    window.__INITIAL_SERVER_DATA__ = ${JSON.stringify(initialData)};
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: dataScript }} />
      {children}
    </>
  );
}
