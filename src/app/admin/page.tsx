import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import Workspace from './Workspace';
import Login from './Login';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Admin Panel',
};

// Next.js App Router Server Component
export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('avbt_cms_session')?.value === 'true';

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Workspace />;
}
