import type { Metadata } from 'next';
import Workspace from './Workspace';
import Login from './Login';
import { isSessionValid } from './actions';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Admin Panel',
};

// Next.js App Router Server Component
export default async function AdminPage() {
  const isAuthenticated = await isSessionValid();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Workspace />;
}
