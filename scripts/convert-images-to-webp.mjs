import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CONTENT_DIR = path.join(process.cwd(), 'content');

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.heic', '.heif'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function convertImages() {
  console.log('Starting image conversion to WebP...');

  const allFiles = getAllFiles(PUBLIC_DIR);
  const imageFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext) && !file.endsWith('.webp');
  });

  console.log(`Found ${imageFiles.length} images to convert.`);

  const pathReplacements = new Map();

  for (const filePath of imageFiles) {
    const parsed = path.parse(filePath);
    const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

    try {
      const originalSize = fs.statSync(filePath).size;

      // Determine max dimension based on file location
      let maxDimension = 1920;
      if (filePath.includes('hero')) maxDimension = 1200;
      if (filePath.includes('events')) maxDimension = 1200;
      if (filePath.includes('projects')) maxDimension = 1200;
      if (parsed.base === 'logo.png') maxDimension = 800;

      await sharp(filePath)
        .resize({
          width: maxDimension,
          height: maxDimension,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);

      const webpSize = fs.statSync(webpPath).size;
      const reduction = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);

      console.log(
        `Converted: ${parsed.base} -> ${parsed.name}.webp (${(originalSize / 1024).toFixed(1)} KB -> ${(
          webpSize / 1024
        ).toFixed(1)} KB, -${reduction}%)`
      );

      // Track relative URL path mapping for content replacements
      const relOriginal = filePath.replace(PUBLIC_DIR, '').replace(/\\/g, '/');
      const relWebp = webpPath.replace(PUBLIC_DIR, '').replace(/\\/g, '/');
      pathReplacements.set(relOriginal, relWebp);
    } catch (err) {
      console.error(`Failed to convert ${parsed.base}:`, err);
    }
  }

  console.log('\nUpdating image references in content files...');
  updateContentReferences(pathReplacements);
}

function updateContentReferences(replacements) {
  const contentFiles = getAllFiles(CONTENT_DIR).filter(
    (file) => file.endsWith('.md') || file.endsWith('.json')
  );

  let updatedCount = 0;

  for (const filePath of contentFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Replace original image extensions with .webp in content files
    for (const [origPath, webpPath] of replacements.entries()) {
      if (content.includes(origPath)) {
        content = content.replaceAll(origPath, webpPath);
        modified = true;
      }
    }

    // Generic regex fallback for image extensions inside markdown/json frontmatter
    const genericUpdatedContent = content.replace(
      /(\/images\/[^\s"'\)]+)\.(jpg|jpeg|png|heic)/gi,
      '$1.webp'
    );

    if (genericUpdatedContent !== content) {
      content = genericUpdatedContent;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      updatedCount++;
      console.log(`Updated references in: ${path.basename(filePath)}`);
    }
  }

  console.log(`Finished updating ${updatedCount} content files.`);
}

convertImages().catch((err) => {
  console.error('Error during image conversion script:', err);
  process.exit(1);
});
