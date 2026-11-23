import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, type ContentType } from '@/lib/adminService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const VALID_TYPES = new Set<ContentType>(['events', 'blog', 'projects', 'team', 'hero']);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = String(formData.get('type') || '');
    const filename = String(formData.get('filename') || '');
    const file = formData.get('file');

    if (!VALID_TYPES.has(type as ContentType) || !filename || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'MISSING_FIELDS' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await uploadImage(type as ContentType, filename, Buffer.from(arrayBuffer));
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'INTERNAL_SERVER_ERROR';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
