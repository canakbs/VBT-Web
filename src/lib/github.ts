function getGithubConfig() {
  return {
    pat: process.env.GITHUB_PAT,
    owner: process.env.GITHUB_OWNER || 'canakbs',
    repo: process.env.GITHUB_REPO || 'VBT-Web',
  };
}

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

export interface MultiFileCommitEntry {
  path: string;
  content: string;
  encoding: 'utf-8' | 'base64';
}

async function githubFetch(endpoint: string, options: RequestInit = {}) {
  const { pat, owner, repo } = getGithubConfig();
  if (!pat) {
    throw new Error('GITHUB_PAT_NOT_CONFIGURED');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/${endpoint}`;
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${pat}`);
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
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('404')) {
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

  const body: { message: string; content: string; branch: string; sha?: string } = {
    message,
    content: base64Content,
    branch: 'main',
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await githubFetch(`contents/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return { sha: res?.content?.sha || res?.sha || '' };
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
  const body: { message: string; content: string; branch: string; sha?: string } = {
    message,
    content: base64Content,
    branch: 'main',
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await githubFetch(`contents/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return { sha: res?.content?.sha || res?.sha || '' };
}

export async function commitMultipleFiles(
  files: MultiFileCommitEntry[],
  message: string,
  branch: string = 'main'
): Promise<{ commitSha: string; fileShas: Record<string, string> }> {
  if (!files.length) {
    throw new Error('NO_FILES_TO_COMMIT');
  }

  // 1. Get latest commit on target branch
  const refData = await githubFetch(`git/ref/heads/${branch}`);
  const baseCommitSha: string = refData.object.sha;

  // 2. Get base tree SHA
  const commitData = await githubFetch(`git/commits/${baseCommitSha}`);
  const baseTreeSha: string = commitData.tree.sha;

  // 3. Create blobs for all files in parallel
  const fileShas: Record<string, string> = {};
  const treeEntries = await Promise.all(
    files.map(async (file) => {
      const blob = await githubFetch('git/blobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: file.content,
          encoding: file.encoding,
        }),
      });
      fileShas[file.path] = blob.sha;
      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      };
    })
  );

  // 4. Create new tree
  const newTree = await githubFetch('git/trees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeEntries,
    }),
  });

  // 5. Create new commit
  const newCommit = await githubFetch('git/commits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [baseCommitSha],
    }),
  });

  // 6. Fast-forward branch ref
  await githubFetch(`git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sha: newCommit.sha,
      force: false,
    }),
  });

  return {
    commitSha: newCommit.sha,
    fileShas,
  };
}
