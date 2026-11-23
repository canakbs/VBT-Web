import { NextRequest, NextResponse } from 'next/server';
import {
  requestAdminOtp,
  verifyAdminOtp,
  resendAdminOtp,
  logoutAdmin,
} from '@/lib/adminService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body?.action;

    if (action === 'request_otp') {
      const result = await requestAdminOtp(String(body?.passcode || ''));
      return NextResponse.json(result);
    }

    if (action === 'verify_otp') {
      const result = await verifyAdminOtp(String(body?.otp || ''));
      return NextResponse.json(result);
    }

    if (action === 'resend_otp') {
      const result = await resendAdminOtp();
      return NextResponse.json(result);
    }

    if (action === 'logout') {
      await logoutAdmin();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'INVALID_ACTION' }, { status: 400 });
  } catch (err: unknown) {
    console.error('Admin auth API error:', err);
    const message = err instanceof Error ? err.message : 'INTERNAL_SERVER_ERROR';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
