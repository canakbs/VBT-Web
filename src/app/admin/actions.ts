'use server';

import { cookies } from 'next/headers';

const DEFAULT_PASSCODE = 'avbt2026';

export async function authenticate(passcode: string): Promise<{ success: boolean; error?: string }> {
  // If the admin passcode is set as an environment variable, use it. Otherwise fall back to 'avbt2026'
  const adminPasscode = process.env.ADMIN_PASSCODE || DEFAULT_PASSCODE;

  if (passcode === adminPasscode) {
    const cookieStore = await cookies();
    cookieStore.set('avbt_cms_session', 'true', {
      httpOnly: true, // Crucial: Javascript on the client cannot read this cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day session duration
      path: '/admin',
    });
    return { success: true };
  }

  return { success: false, error: 'SECURE INTERRUPT: INVALID SYSTEM PROTOCOL CODE' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('avbt_cms_session');
}
