export interface OptimizedUploadImage {
  file: File;
  filename: string;
  previewUrl: string;
  wasConverted: boolean;
}

function stripExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
}

/**
 * Resizes an image to max 1200x1200 and converts it to WebP on the client side
 * before uploading. This keeps uploads tiny (~100 KB instead of 4+ MB) and avoids
 * Vercel's 4.5 MB serverless body limit while preserving fallback to server-side sharp.
 */
export async function optimizeImageForUpload(
  originalFile: File,
  targetBaseName: string,
  maxDimension: number = 1200,
  quality: number = 0.8
): Promise<OptimizedUploadImage> {
  const cleanBase = stripExtension(targetBaseName).replace(/[^a-zA-Z0-9.\-_]/g, '') || `image-${Date.now()}`;
  const webpFilename = `${cleanBase}.webp`;
  const origExtMatch = originalFile.name.match(/\.[a-zA-Z0-9]+$/);
  const fallbackFilename = `${cleanBase}${origExtMatch ? origExtMatch[0].toLowerCase() : '.jpg'}`;

  // Skip canvas conversion for GIF/SVG to preserve animation/vector
  if (originalFile.type === 'image/svg+xml' || originalFile.type === 'image/gif') {
    return {
      file: originalFile,
      filename: fallbackFilename,
      previewUrl: URL.createObjectURL(originalFile),
      wasConverted: false,
    };
  }

  const tempUrl = URL.createObjectURL(originalFile);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('BROWSER_CANNOT_DECODE_IMAGE'));
      element.src = tempUrl;
    });

    let { naturalWidth: width, naturalHeight: height } = img;
    if (!width || !height) {
      throw new Error('INVALID_IMAGE_DIMENSIONS');
    }

    if (width > maxDimension || height > maxDimension) {
      const ratio = Math.min(maxDimension / width, maxDimension / height);
      width = Math.max(1, Math.round(width * ratio));
      height = Math.max(1, Math.round(height * ratio));
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('CANVAS_CONTEXT_UNAVAILABLE');
    }

    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((result) => resolve(result), 'image/webp', quality)
    );

    if (!blob || blob.type !== 'image/webp' || blob.size === 0) {
      throw new Error('WEBP_EXPORT_NOT_SUPPORTED');
    }

    URL.revokeObjectURL(tempUrl);

    const convertedFile = new File([blob], webpFilename, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    return {
      file: convertedFile,
      filename: webpFilename,
      previewUrl: URL.createObjectURL(blob),
      wasConverted: true,
    };
  } catch {
    // Graceful fallback: send original file so server-side sharp can process it
    return {
      file: originalFile,
      filename: fallbackFilename,
      previewUrl: tempUrl,
      wasConverted: false,
    };
  }
}
