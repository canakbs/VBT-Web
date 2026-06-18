import { cookies } from 'next/headers';
import Workspace from './Workspace';
import Login from './Login';

// Next.js App Router Server Component
export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('avbt_cms_session')?.value === 'true';

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Workspace />;
}
