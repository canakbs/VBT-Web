import { NextRequest, NextResponse } from 'next/server';
import {
  getContentList,
  getFileContent,
  saveContent,
  deleteContent,
  type ContentType,
  type PendingImageUpload,
} from '@/lib/adminService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const VALID_TYPES = new Set<ContentType>(['events', 'blog', 'projects', 'team', 'hero']);

function isValidContentType(value: string | null): value is ContentType {
  return !!value && VALID_TYPES.has(value as ContentType);
}

function handleError(err: unknown) {
  const message = err instanceof Error ? err.message : 'INTERNAL_SERVER_ERROR';
  const status = message === 'UNAUTHORIZED' ? 401 : message.startsWith('INVALID_') || message.startsWith('MISSING_') ? 400 : 500;
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const filePath = searchParams.get('path');
    const type = searchParams.get('type');

    if (filePath) {
      const fileData = await getFileContent(filePath);
      return NextResponse.json(fileData);
    }

    if (isValidContentType(type)) {
      const list = await getContentList(type);
      return NextResponse.json({ items: list });
    }

    return NextResponse.json({ error: 'INVALID_QUERY_PARAMETERS' }, { status: 400 });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentTypeHeader = request.headers.get('content-type') || '';

    if (contentTypeHeader.includes('multipart/form-data')) {
      const formData = await request.formData();
      const type = String(formData.get('type') || '');
      const filename = String(formData.get('filename') || '');
      const markdown = String(formData.get('markdown') || '');
      const shaRaw = formData.get('sha');
      const sha = typeof shaRaw === 'string' && shaRaw.trim() ? shaRaw : undefined;

      if (!isValidContentType(type) || !filename || !markdown) {
        return NextResponse.json({ success: false, error: 'MISSING_FIELDS' }, { status: 400 });
      }

      let imageUpload: PendingImageUpload | undefined;
      const imageFile = formData.get('imageFile');
      const imageFilename = formData.get('imageFilename');
      const imageDestFolderRaw = formData.get('imageDestFolder');

      if (imageFile instanceof File && typeof imageFilename === 'string' && imageFilename) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const destFolder =
          typeof imageDestFolderRaw === 'string' && isValidContentType(imageDestFolderRaw)
            ? imageDestFolderRaw
            : type;
        imageUpload = {
          filename: imageFilename,
          buffer: Buffer.from(arrayBuffer),
          destFolder,
        };
      }

      const result = await saveContent(type, filename, markdown, sha, imageUpload);
      return NextResponse.json(result);
    }

    const body = await request.json();
    const type = String(body?.type || '');
    const filename = String(body?.filename || '');
    const markdown = String(body?.markdown || '');
    const sha = typeof body?.sha === 'string' && body.sha.trim() ? body.sha : undefined;

    if (!isValidContentType(type) || !filename || !markdown) {
      return NextResponse.json({ success: false, error: 'MISSING_FIELDS' }, { status: 400 });
    }

    const result = await saveContent(type, filename, markdown, sha);
    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const filePath = String(body?.path || '');
    const sha = String(body?.sha || '');

    if (!filePath) {
      return NextResponse.json({ success: false, error: 'MISSING_PATH' }, { status: 400 });
    }

    const result = await deleteContent(filePath, sha);
    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}
