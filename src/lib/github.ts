const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'canakbs';
const GITHUB_REPO = process.env.GITHUB_REPO || 'VBT-Web';

export interface GithubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: string;
  download_url: string | null;
}

export interface GithubFileResponse {
  content: string;
  sha: string;
}

async function githubFetch(endpoint: string, options: RequestInit = {}) {
  if (!GITHUB_PAT) {
    throw new Error('GITHUB_PAT_NOT_CONFIGURED');
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${endpoint}`;
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${GITHUB_PAT}`);
  headers.set('Accept', 'application/vnd.github+json');
  headers.set('X-GitHub-Api-Version', '2022-11-28');
  headers.set('User-Agent', 'AVBT-CMS-Engine');

  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store', // Avoid caching to display updates instantly
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GITHUB_API_ERROR: ${res.status} ${errText}`);
  }

  return res.json();
}

export async function listDirectoryContents(path: string): Promise<GithubFile[]> {
  try {
    return await githubFetch(`contents/${path}`);
  } catch (err: any) {
    if (err.message && err.message.includes('404')) {
      return [];
    }
    throw err;
  }
}

export async function getFile(path: string): Promise<GithubFileResponse> {
  return await githubFetch(`contents/${path}`);
}

export async function commitFile(
  path: string,
  contentString: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  // Safe base64 encoding for unicode characters
  const base64Content = Buffer.from(contentString, 'utf-8').toString('base64');

  const body: any = {
    message,
    content: base64Content,
    branch: 'main',
  };

  if (sha) {
    body.sha = sha;
  }

  return await githubFetch(`contents/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function deleteFileFromRepo(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  const body = {
    message,
    sha,
    branch: 'main',
  };

  await githubFetch(`contents/${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function commitBinaryFile(
  path: string,
  base64Content: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  const body: any = {
    message,
    content: base64Content,
    branch: 'main',
  };

  if (sha) {
    body.sha = sha;
  }

  return await githubFetch(`contents/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
