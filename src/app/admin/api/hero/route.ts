import { NextRequest, NextResponse } from 'next/server';
import {
  getHeroFrames,
  saveHeroFrames,
  type PendingHeroImageUpload,
} from '@/lib/adminService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function handleError(err: unknown) {
  const message = err instanceof Error ? err.message : 'INTERNAL_SERVER_ERROR';
  const status = message === 'UNAUTHORIZED' ? 401 : 500;
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  try {
    const result = await getHeroFrames();
    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentTypeHeader = request.headers.get('content-type') || '';

    if (contentTypeHeader.includes('multipart/form-data')) {
      const formData = await request.formData();
      const framesRaw = String(formData.get('frames') || '[]');
      const shaRaw = formData.get('sha');
      const sha = typeof shaRaw === 'string' && shaRaw.trim() ? shaRaw : undefined;

      const frames = JSON.parse(framesRaw);
      const pendingImages: PendingHeroImageUpload[] = [];

      const imageMetaRaw = formData.get('imageMeta');
      if (typeof imageMetaRaw === 'string' && imageMetaRaw) {
        const metaList: Array<{ index: number; fieldName: string; filename: string }> =
          JSON.parse(imageMetaRaw);
        for (const meta of metaList) {
          const file = formData.get(meta.fieldName);
          if (file instanceof File) {
            const arrayBuffer = await file.arrayBuffer();
            pendingImages.push({
              index: meta.index,
              filename: meta.filename,
              buffer: Buffer.from(arrayBuffer),
            });
          }
        }
      }

      const result = await saveHeroFrames(frames, sha, pendingImages);
      return NextResponse.json(result);
    }

    const body = await request.json();
    const frames = Array.isArray(body?.frames) ? body.frames : [];
    const sha = typeof body?.sha === 'string' && body.sha.trim() ? body.sha : undefined;

    const result = await saveHeroFrames(frames, sha);
    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}
