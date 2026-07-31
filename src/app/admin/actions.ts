'use server';

import { cookies } from 'next/headers';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { 
  listDirectoryContents, 
  getFile, 
  commitFile, 
  deleteFileFromRepo,
  commitBinaryFile
} from '@/lib/github';

const HAS_GITHUB_PAT = !!process.env.GITHUB_PAT;

// 1. Session Management Actions
export async function authenticate(passcode: string): Promise<{ success: boolean; error?: string }> {
  const adminPasscode = process.env.ADMIN_PASSCODE;

  if (!adminPasscode) {
    return { success: false, error: 'SİSTEM YAPILANDIRMASI EKSİK' };
  }

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

  return { success: false, error: 'GEÇERSİZ ERİŞİM PAROLASI' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('avbt_cms_session');
}

// 2. CMS CRUD Actions (Protected by Session Checks)
export async function getContentList(type: 'events' | 'blog' | 'projects' | 'team' | 'hero') {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  // 1. If GITHUB_PAT is set, try GitHub API
  if (HAS_GITHUB_PAT) {
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
              department: data.department || '',
              role: data.role || '',
              stage: data.stage || '',
              category: data.category || '',
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
              department: '',
              role: '',
              stage: '',
              category: '',
            };
          }
        })
      );

      return detailedFiles.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        if (dateA === 0 && dateB === 0) {
          return a.name.localeCompare(b.name);
        }
        return dateB - dateA;
      });
    } catch (err) {
      console.warn('GitHub API fetch failed, falling back to local filesystem:', err);
    }
  }

  // 2. Local Filesystem Fallback
  try {
    const dirPath = path.join(process.cwd(), 'content', type);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    const detailedFiles = files.map((filename) => {
      const filePath = path.join(dirPath, filename);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(rawContent);
      return {
        name: filename,
        path: `content/${type}/${filename}`,
        sha: `local-${filename}`,
        title: data.title || filename.replace(/\.md$/, ''),
        date: data.date || '',
        summary: data.summary || '',
        department: data.department || '',
        role: data.role || '',
        stage: data.stage || '',
        category: data.category || '',
      };
    });

    return detailedFiles.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      if (dateA === 0 && dateB === 0) {
        return a.name.localeCompare(b.name);
      }
      return dateB - dateA;
    });
  } catch (err: any) {
    console.error(`Error fetching local list for ${type}:`, err);
    throw new Error(err.message || 'FAILED_TO_FETCH_LIST');
  }
}

export async function getFileContent(filePath: string) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  if (HAS_GITHUB_PAT) {
    try {
      const fileData = await getFile(filePath);
      const rawContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const { data, content } = matter(rawContent);

      return {
        sha: fileData.sha,
        metadata: data,
        content: content.trim(),
      };
    } catch (err) {
      console.warn('GitHub API get file failed, falling back to local fs:', err);
    }
  }

  // Local Filesystem Fallback
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error('FILE_NOT_FOUND');
    }
    const rawContent = fs.readFileSync(absolutePath, 'utf-8');
    const { data, content } = matter(rawContent);

    return {
      sha: `local-${path.basename(filePath)}`,
      metadata: data,
      content: content.trim(),
    };
  } catch (err: any) {
    console.error(`Error fetching content for ${filePath}:`, err);
    throw new Error(err.message || 'FAILED_TO_FETCH_FILE');
  }
}

export async function saveContent(
  type: 'events' | 'blog' | 'projects' | 'team' | 'hero',
  filename: string,
  markdown: string,
  sha?: string
) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  const relativePath = `content/${type}/${filename}`;

  // Always write to local disk first so changes are immediate
  try {
    const dirPath = path.join(process.cwd(), 'content', type);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, filename), markdown, 'utf-8');
  } catch (err) {
    console.error('Error writing file locally:', err);
  }

  // Also push to GitHub if PAT is available
  if (HAS_GITHUB_PAT) {
    const action = sha ? 'Update' : 'Create';
    const message = `CMS: ${action} ${type} content - ${filename}`;
    try {
      const result = await commitFile(relativePath, markdown, message, sha?.startsWith('local-') ? undefined : sha);
      return { success: true, sha: result.sha };
    } catch (err: any) {
      console.error(`Error saving content to GitHub ${relativePath}:`, err);
    }
  }

  return { success: true, sha: `local-${filename}` };
}

export async function deleteContent(filePath: string, sha: string) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  // Local filesystem deletion
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.error('Error deleting local file:', err);
  }

  // GitHub API deletion if PAT is set
  if (HAS_GITHUB_PAT && !sha.startsWith('local-')) {
    const message = `CMS: Delete content file - ${filePath}`;
    try {
      await deleteFileFromRepo(filePath, sha, message);
    } catch (err: any) {
      console.error(`Error deleting content at ${filePath} on GitHub:`, err);
    }
  }

  return { success: true };
}

export async function uploadImageAction(formData: FormData) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  const type = formData.get('type') as 'events' | 'blog' | 'projects' | 'team' | 'hero';
  const filename = formData.get('filename') as string;
  const file = formData.get('file') as File;

  if (!type || !filename || !file) {
    throw new Error('MISSING_FIELDS');
  }

  const relativePath = `public/images/${type}/${filename}`;
  const webPath = `/images/${type}/${filename}`;

  let buffer: Buffer;
  try {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch (err) {
    console.error('Error reading uploaded file:', err);
    throw new Error('FAILED_TO_READ_FILE');
  }

  // Write image file locally
  try {
    const dirPath = path.join(process.cwd(), 'public', 'images', type);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, filename), buffer);
  } catch (err) {
    console.error('Error writing image file locally:', err);
  }

  // Upload to GitHub if PAT is available
  if (HAS_GITHUB_PAT) {
    const message = `CMS: Upload image ${filename}`;
    try {
      await commitBinaryFile(relativePath, buffer.toString('base64'), message);
    } catch (err: any) {
      console.error(`Error uploading image to GitHub ${relativePath}:`, err);
    }
  }

  return { success: true, path: webPath };
}

export async function getApplicationsList() {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  try {
    const dirPath = path.join(process.cwd(), 'content', 'applications');
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.json'));
    const records = files.map((filename) => {
      const filePath = path.join(dirPath, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      return {
        id: filename,
        submittedAt: data.submittedAt || '',
        fullName: data.fullName || '',
        email: data.email || '',
        selectedInterests: data.selectedInterests || [],
        level: data.level || '',
        department: data.department || '',
        goals: data.goals || '',
      };
    });

    return records.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  } catch (err) {
    console.error('Error fetching applications:', err);
    return [];
  }
}

export async function deleteApplication(id: string) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  try {
    const filePath = path.join(process.cwd(), 'content', 'applications', id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting application:', err);
    throw new Error(err.message || 'FAILED_TO_DELETE');
  }
}

export async function getHeroFrames() {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  if (HAS_GITHUB_PAT) {
    try {
      const fileData = await getFile('content/hero-frames.json');
      const rawContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const data = JSON.parse(rawContent);
      return {
        sha: fileData.sha,
        frames: data,
      };
    } catch (err) {
      console.warn('GitHub API get hero-frames failed, falling back to local fs:', err);
    }
  }

  try {
    const filePath = path.join(process.cwd(), 'content', 'hero-frames.json');
    if (!fs.existsSync(filePath)) {
      return {
        sha: 'local-hero-frames',
        frames: [],
      };
    }
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawContent);
    return {
      sha: 'local-hero-frames',
      frames: data,
    };
  } catch (err: any) {
    console.error('Error fetching local hero-frames:', err);
    throw new Error(err.message || 'FAILED_TO_FETCH_HERO_FRAMES');
  }
}

export async function saveHeroFrames(frames: any[], sha?: string) {
  const cookieStore = await cookies();
  if (cookieStore.get('avbt_cms_session')?.value !== 'true') {
    throw new Error('UNAUTHORIZED');
  }

  const relativePath = 'content/hero-frames.json';
  const contentString = JSON.stringify(frames, null, 2);

  try {
    const filePath = path.join(process.cwd(), relativePath);
    fs.writeFileSync(filePath, contentString, 'utf-8');
  } catch (err) {
    console.error('Error writing hero-frames locally:', err);
  }

  if (HAS_GITHUB_PAT) {
    const message = 'CMS: Update hero frames configuration';
    try {
      const result = await commitFile(relativePath, contentString, message, sha?.startsWith('local-') ? undefined : sha);
      return { success: true, sha: result.sha };
    } catch (err: any) {
      console.error('Error saving hero-frames to GitHub:', err);
    }
  }

  return { success: true, sha: 'local-hero-frames' };
}
