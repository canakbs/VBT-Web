import fs from 'fs';
import path from 'path';

function getAllFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((file) => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) getAllFiles(p, files);
    else if (p.endsWith('.md') || p.endsWith('.json')) files.push(p);
  });
  return files;
}

const contentFiles = getAllFiles(path.join(process.cwd(), 'content'));
let missing = 0;

contentFiles.forEach((f) => {
  const text = fs.readFileSync(f, 'utf8');
  const matches = text.match(/\/images\/[^\s"'\)]+/g) || [];
  matches.forEach((img) => {
    const fullImgPath = path.join(process.cwd(), 'public', img);
    if (!fs.existsSync(fullImgPath)) {
      console.log('MISSING IMAGE:', img, 'in', path.basename(f));
      missing++;
    }
  });
});

console.log('Check complete. Missing count:', missing);
