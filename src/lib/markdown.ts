import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MarkdownFile {
  slug: string;
  content: string;
  metadata: {
    title?: string;
    date?: string;
    category?: string;
    stats?: string;
    outcome?: string;
    image?: string;
    summary?: string;
    tags?: string[];
    author?: string;
    stage?: string;
    github?: string;
    [key: string]: any;
  };
}

export function getFilesFromDir(subDir: string): MarkdownFile[] {
  const dirPath = path.join(contentDirectory, subDir);
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const fullPath = path.join(dirPath, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug,
        content,
        metadata: data as MarkdownFile['metadata'],
      };
    })
    .sort((a, b) => {
      const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0;
      const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0;
      // Projects don't always have a date, so we fallback to slug sorting if dates are equal
      if (dateA === 0 && dateB === 0) {
        return a.slug.localeCompare(b.slug);
      }
      return dateB - dateA;
    });
}
