'use server';

import { cookies } from 'next/headers';
import matter from 'gray-matter';
import { 
  listDirectoryContents, 
  getFile, 
  commitFile, 
  deleteFileFromRepo 
} from '@/lib/github';

const DEFAULT_PASSCODE = 'avbt2026';

// 1. Session Management Actions
export async function authenticate(passcode: string): Promise<{ success: boolean; error?: string }> {
  const adminPasscode = process.env.ADMIN_PASSCODE || DEFAULT_PASSCODE;

  if (passcode === adminPasscode) {
    const cookieStore = await cookies();
    cookieStore.set('avbt_cms_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
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

// 2. CMS CRUD Actions (Protected by Session Checks)
export async function getContentList(type: 'events' | 'blog' | 'projects') {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  try {
    const files = await listDirectoryContents(`content/${type}`);
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    const detailedFiles = await Promise.all(
      mdFiles.map(async (f) => {
        try {
          const fileData = await getFile(f.path);
          const contentString = Buffer.from(fileData.content, 'base64').toString('utf-8');
          const { data } = matter(contentString);
          return {
            name: f.name,
            path: f.path,
            sha: f.sha,
            title: data.title || f.name.replace(/\.md$/, ''),
            date: data.date || '',
            summary: data.summary || '',
          };
        } catch (e) {
          console.error(`Error loading details for ${f.path}:`, e);
          return {
            name: f.name,
            path: f.path,
            sha: f.sha,
            title: f.name.replace(/\.md$/, ''),
            date: '',
            summary: '',
          };
        }
      })
    );

    // Sort by date (descending)
    return detailedFiles.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      if (dateA === 0 && dateB === 0) {
        return a.name.localeCompare(b.name);
      }
      return dateB - dateA;
    });
  } catch (err: any) {
    console.error(`Error fetching list for ${type}:`, err);
    throw new Error(err.message || 'FAILED_TO_FETCH_LIST');
  }
}

export async function getFileContent(path: string) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  try {
    const fileData = await getFile(path);
    const rawContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const { data, content } = matter(rawContent);

    return {
      sha: fileData.sha,
      metadata: data,
      content: content.trim(),
    };
  } catch (err: any) {
    console.error(`Error fetching content for ${path}:`, err);
    throw new Error(err.message || 'FAILED_TO_FETCH_FILE');
  }
}

export async function saveContent(
  type: 'events' | 'blog' | 'projects',
  filename: string,
  markdown: string,
  sha?: string
) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  const path = `content/${type}/${filename}`;
  const action = sha ? 'Update' : 'Create';
  const message = `CMS: ${action} ${type} content - ${filename}`;

  try {
    const result = await commitFile(path, markdown, message, sha);
    return { success: true, sha: result.sha };
  } catch (err: any) {
    console.error(`Error saving content to ${path}:`, err);
    throw new Error(err.message || 'FAILED_TO_SAVE_CONTENT');
  }
}

export async function deleteContent(path: string, sha: string) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  const message = `CMS: Delete content file - ${path}`;

  try {
    await deleteFileFromRepo(path, sha, message);
    return { success: true };
  } catch (err: any) {
    console.error(`Error deleting content at ${path}:`, err);
    throw new Error(err.message || 'FAILED_TO_DELETE_CONTENT');
  }
}
