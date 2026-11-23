import { NextRequest, NextResponse } from 'next/server';
import { getApplicationsList, deleteApplication } from '@/lib/adminService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function handleError(err: unknown) {
  const message = err instanceof Error ? err.message : 'INTERNAL_SERVER_ERROR';
  const status = message === 'UNAUTHORIZED' ? 401 : 500;
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  try {
    const records = await getApplicationsList();
    return NextResponse.json({ items: records });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const id = String(body?.id || '');

    if (!id) {
      return NextResponse.json({ success: false, error: 'MISSING_ID' }, { status: 400 });
    }

    const result = await deleteApplication(id);
    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}
