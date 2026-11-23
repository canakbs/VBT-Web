import { cookies } from 'next/headers';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import {
  listDirectoryContents,
  getFile,
  commitFile,
  deleteFileFromRepo,
  commitBinaryFile,
  commitMultipleFiles,
  type MultiFileCommitEntry,
} from '@/lib/github';

export type ContentType = 'events' | 'blog' | 'projects' | 'team' | 'hero';

export interface PendingImageUpload {
  filename: string;
  buffer: Buffer;
  destFolder?: ContentType;
}

export interface PendingHeroImageUpload {
  index: number;
  filename: string;
  buffer: Buffer;
}

function hasGithubPat(): boolean {
  return !!process.env.GITHUB_PAT;
}

function isWebpBuffer(buf: Buffer): boolean {
  return (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buf.subarray(8, 12).toString('ascii') === 'WEBP'
  );
}

// Security Helpers
function getExpectedSessionToken(): string {
  const adminPasscode = process.env.ADMIN_PASSCODE || '';
  if (!adminPasscode) return '';
  return crypto
    .createHmac('sha256', adminPasscode)
    .update('avbt_cms_authenticated_session_v1')
    .digest('hex');
}

export async function isSessionValid(): Promise<boolean> {
  const expectedToken = getExpectedSessionToken();
  if (!expectedToken) return false;

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get('avbt_cms_session')?.value;
  if (!sessionValue) return false;

  const a = Buffer.from(sessionValue);
  const b = Buffer.from(expectedToken);
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

function sanitizePath(
  inputPath: string,
  allowedPrefixes: string[] = ['content/', 'public/images/']
): string {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('INVALID_PATH');
  }
  const cleanPath = inputPath.replace(/\0/g, '').replace(/\\/g, '/');
  const normalized = path.normalize(cleanPath).replace(/\\/g, '/');

  if (cleanPath.includes('..') || normalized.includes('..')) {
    throw new Error('INVALID_PATH_TRAVERSAL');
  }

  const isAllowed = allowedPrefixes.some(
    (prefix) => normalized.startsWith(prefix) || cleanPath.startsWith(prefix)
  );
  if (!isAllowed) {
    throw new Error('UNAUTHORIZED_PATH_ACCESS');
  }

  return cleanPath;
}

function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    throw new Error('INVALID_FILENAME');
  }
  const safeName = path.basename(filename.replace(/\\/g, '/'));
  if (
    safeName !== filename ||
    filename.includes('..') ||
    filename.includes('/') ||
    filename.includes('\\')
  ) {
    throw new Error('INVALID_FILENAME_TRAVERSAL');
  }
  return safeName;
}

// Image Processing Helper
async function processUploadedImage(
  type: ContentType,
  filename: string,
  buffer: Buffer
): Promise<{
  buffer: Buffer;
  filename: string;
  relativePath: string;
  webPath: string;
}> {
  const safeFilename = sanitizeFilename(filename);
  const parsed = path.parse(safeFilename);
  const nameWithoutExt = parsed.name || `image-${Date.now()}`;
  const origExt = (parsed.ext || '.jpg').toLowerCase();

  let processedBuffer = buffer;
  let finalFilename = `${nameWithoutExt}.webp`;

  // If the client already converted to a compact WebP, avoid re-encoding loss
  if (isWebpBuffer(buffer) && buffer.length <= 600 * 1024) {
    processedBuffer = buffer;
    finalFilename = `${nameWithoutExt}.webp`;
  } else {
    try {
      const sharpModule = await import('sharp');
      const sharp = sharpModule.default || sharpModule;
      processedBuffer = await sharp(buffer)
        .rotate()
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();
      finalFilename = `${nameWithoutExt}.webp`;
    } catch (err) {
      console.error('Failed to convert uploaded image to WebP, falling back to original:', err);
      // Do NOT mislabel a raw JPEG/PNG as .webp if conversion failed
      finalFilename = isWebpBuffer(buffer)
        ? `${nameWithoutExt}.webp`
        : `${nameWithoutExt}${origExt}`;
    }
  }

  const relativePath = sanitizePath(`public/images/${type}/${finalFilename}`, ['public/images/']);
  const webPath = `/images/${type}/${finalFilename}`;

  return {
    buffer: processedBuffer,
    filename: finalFilename,
    relativePath,
    webPath,
  };
}

// 1. Session Management & 2FA OTP
async function sendAdminOtpEmail(otpCode: string): Promise<boolean> {
  const targetEmail = 'akdenizveri07@gmail.com';
  const rawPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const cleanPass = rawPass ? rawPass.replace(/\s+/g, '') : '';
  const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER || 'akdenizveri07@gmail.com';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  const subject = `[AVBT Admin] Giriş Doğrulama Kodu: ${otpCode}`;

  const textContent = `
AKDENİZ VERİ BİLİMİ TOPLULUĞU - ADMİN PANELE GİRİŞ DOĞRULAMA KODU
==================================================================
Güvenlik Kodunuz: ${otpCode}

Bu kod 5 dakika boyunca geçerlidir.
Eğer bu giriş denemesini siz yapmadıysanız lütfen şifrenizi değiştirin.
==================================================================`;

  const htmlContent = `
    <div style="font-family: system-ui, -apple-system, sans-serif; background-color: #090d16; color: #e2e8f0; padding: 32px; border-radius: 16px; max-width: 520px; margin: 0 auto; border: 1px solid rgba(0, 242, 254, 0.2);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #00f2fe; margin: 0 0 8px 0; font-size: 22px; font-weight: 800;">AKDENİZ VERİ BİLİMİ TOPLULUĞU</h2>
        <p style="color: #64748b; font-size: 12px; font-family: monospace; text-transform: uppercase; margin: 0;">// ADMİN PANELİ 2 ADIMLI DOĞRULAMA</p>
      </div>

      <div style="background-color: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="color: #94a3b8; font-size: 13px; margin-top: 0; margin-bottom: 12px;">Admin paneline giriş yapmak için aşağıdaki 6 haneli güvenlik kodunu kullanın:</p>
        <div style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #00f5a0; background-color: #020617; padding: 16px; border-radius: 8px; border: 1px dashed rgba(0, 245, 160, 0.4); display: inline-block; margin: 8px 0;">
          ${otpCode}
        </div>
        <p style="color: #f59e0b; font-size: 12px; margin-bottom: 0; margin-top: 12px;">⏰ Bu kod <strong>5 dakika</strong> geçerlidir.</p>
      </div>

      <div style="font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 16px;">
        <p style="margin: 0 0 4px 0;">🔒 Bu e-posta otomatik olarak gönderilmiştir.</p>
        <p style="margin: 0;">Bu giriş isteğini siz başlatmadıysanız, sistem yöneticiniz ile derhal iletişime geçin.</p>
      </div>
    </div>
  `;

  if (cleanPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: cleanPass,
        },
      });

      await transporter.sendMail({
        from: `"AVBT Güvenlik" <${smtpUser}>`,
        to: targetEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ Admin OTP koda (${otpCode}) ${targetEmail} adresine başarıyla gönderildi.`);
      return true;
    } catch (err) {
      console.error('Nodemailer Admin OTP SMTP Error:', err);
    }
  } else {
    console.warn(`⚠️ SMTP şifresi bulunamadı. OTP Kodu konsola yazıldı: ${otpCode}`);
  }
  return false;
}

function maskEmailAddress(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [username, domain] = email.split('@');
  if (username.length <= 6) {
    return `${username.slice(0, 1)}***${username.slice(-1)}@${domain}`;
  }
  return `${username.slice(0, 3)}***${username.slice(-3)}@${domain}`;
}

export async function requestAdminOtp(
  passcode: string
): Promise<{ success: boolean; requireOtp?: boolean; maskedEmail?: string; error?: string }> {
  const adminPasscode = process.env.ADMIN_PASSCODE;

  if (!adminPasscode) {
    return { success: false, error: 'SİSTEM YAPILANDIRMASI EKSİK' };
  }

  // Rate limit: Max 5 password attempts per 5 minutes per client IP
  const rateKey = await getClientIdentifier('admin_auth_pass');
  const rateCheck = checkRateLimit(rateKey, 5, 5 * 60 * 1000);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `Çok fazla hatalı deneme yaptınız. Lütfen ${rateCheck.retryAfterSeconds} saniye bekleyin.`,
    };
  }

  if (passcode !== adminPasscode) {
    return { success: false, error: 'GEÇERSİZ ERİŞİM PAROLASI' };
  }

  // Generate 6-digit random OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const challengeId = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  const hash = crypto
    .createHmac('sha256', adminPasscode)
    .update(`avbt_otp_${challengeId}_${otpCode}_${expiresAt}`)
    .digest('hex');

  const challengePayload = {
    challengeId,
    hash,
    expiresAt,
    attempts: 0,
  };

  const cookieStore = await cookies();
  cookieStore.set('avbt_admin_otp_challenge', JSON.stringify(challengePayload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 300, // 5 mins
    path: '/admin',
  });

  await sendAdminOtpEmail(otpCode);

  return {
    success: true,
    requireOtp: true,
    maskedEmail: maskEmailAddress('akdenizveri07@gmail.com'),
  };
}

export async function verifyAdminOtp(
  otpInput: string
): Promise<{ success: boolean; error?: string }> {
  const adminPasscode = process.env.ADMIN_PASSCODE;
  if (!adminPasscode) {
    return { success: false, error: 'SİSTEM YAPILANDIRMASI EKSİK' };
  }

  const cookieStore = await cookies();
  const rawChallenge = cookieStore.get('avbt_admin_otp_challenge')?.value;

  if (!rawChallenge) {
    return {
      success: false,
      error: 'DOĞRULAMA SÜRESİ DOLDU VEYA İSTEK GEÇERSİZ. LÜTFEN TEKRAR PAROLA GİRİN.',
    };
  }

  let challengePayload: {
    challengeId: string;
    hash: string;
    expiresAt: number;
    attempts: number;
  };

  try {
    challengePayload = JSON.parse(rawChallenge);
  } catch {
    cookieStore.delete({ name: 'avbt_admin_otp_challenge', path: '/admin' });
    return { success: false, error: 'GEÇERSİZ DOĞRULAMA VERİSİ' };
  }

  const { challengeId, hash, expiresAt, attempts } = challengePayload;

  if (Date.now() > expiresAt) {
    cookieStore.delete({ name: 'avbt_admin_otp_challenge', path: '/admin' });
    return { success: false, error: 'DOĞRULAMA KODUNUN SÜRESİ DOLDU. LÜTFEN YENİ KOD İSTEYİN.' };
  }

  if (attempts >= 5) {
    cookieStore.delete({ name: 'avbt_admin_otp_challenge', path: '/admin' });
    return { success: false, error: 'ÇOK FAZLA HATALI DENEME. LÜTFEN TEKRAR BAŞLAYIN.' };
  }

  const cleanOtp = (otpInput || '').trim();
  const expectedHash = crypto
    .createHmac('sha256', adminPasscode)
    .update(`avbt_otp_${challengeId}_${cleanOtp}_${expiresAt}`)
    .digest('hex');

  const hashA = Buffer.from(hash);
  const hashB = Buffer.from(expectedHash);

  const isValid = hashA.length === hashB.length && crypto.timingSafeEqual(hashA, hashB);

  if (!isValid) {
    challengePayload.attempts += 1;
    cookieStore.set('avbt_admin_otp_challenge', JSON.stringify(challengePayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Math.max(1, Math.ceil((expiresAt - Date.now()) / 1000)),
      path: '/admin',
    });
    return {
      success: false,
      error: `GEÇERSİZ DOĞRULAMA KODU (${5 - challengePayload.attempts} HAKKINIZ KALDI)`,
    };
  }

  cookieStore.delete({ name: 'avbt_admin_otp_challenge', path: '/admin' });

  const token = getExpectedSessionToken();
  cookieStore.set('avbt_cms_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/admin',
  });

  return { success: true };
}

export async function resendAdminOtp(): Promise<{ success: boolean; error?: string }> {
  const adminPasscode = process.env.ADMIN_PASSCODE;
  if (!adminPasscode) {
    return { success: false, error: 'SİSTEM YAPILANDIRMASI EKSİK' };
  }

  const cookieStore = await cookies();
  const rawChallenge = cookieStore.get('avbt_admin_otp_challenge')?.value;

  if (!rawChallenge) {
    return { success: false, error: 'OTURUM SÜRESİ DOLDU. LÜTFEN ŞİFRENİZİ TEKRAR GİRİN.' };
  }

  try {
    JSON.parse(rawChallenge);
  } catch {
    return { success: false, error: 'GEÇERSİZ DOĞRULAMA VERİSİ' };
  }

  const rateKey = await getClientIdentifier('admin_otp_resend');
  const rateCheck = checkRateLimit(rateKey, 1, 45 * 1000);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `Yeni kod istemek için lütfen ${rateCheck.retryAfterSeconds} saniye bekleyin.`,
    };
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const challengeId = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + 5 * 60 * 1000;

  const hash = crypto
    .createHmac('sha256', adminPasscode)
    .update(`avbt_otp_${challengeId}_${otpCode}_${expiresAt}`)
    .digest('hex');

  const newPayload = {
    challengeId,
    hash,
    expiresAt,
    attempts: 0,
  };

  cookieStore.set('avbt_admin_otp_challenge', JSON.stringify(newPayload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 300,
    path: '/admin',
  });

  await sendAdminOtpEmail(otpCode);

  return { success: true };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set('avbt_cms_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    expires: new Date(0),
    path: '/admin',
  });
  cookieStore.delete({ name: 'avbt_cms_session', path: '/admin' });
  cookieStore.delete({ name: 'avbt_admin_otp_challenge', path: '/admin' });
}

// 2. CMS CRUD Operations (Protected by Session Checks)
export async function getContentList(type: ContentType) {
  if (!(await isSessionValid())) {
    throw new Error('UNAUTHORIZED');
  }

  if (hasGithubPat()) {
    try {
      const files = await listDirectoryContents(`content/${type}`);
      const mdFiles = files.filter((f) => f.name.endsWith('.md'));

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

  // Local Filesystem Fallback
  try {
    const dirPath = path.join(process.cwd(), 'content', type);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));
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
  } catch (err: unknown) {
    console.error(`Error fetching local list for ${type}:`, err);
    throw new Error(err instanceof Error ? err.message : 'FAILED_TO_FETCH_LIST');
  }
}

export async function getFileContent(filePath: string) {
  if (!(await isSessionValid())) {
    throw new Error('UNAUTHORIZED');
  }

  const safePath = sanitizePath(filePath, ['content/']);

  if (hasGithubPat()) {
    try {
      const fileData = await getFile(safePath);
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

  try {
    const absolutePath = path.join(/*turbopackIgnore: true*/ process.cwd(), safePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error('FILE_NOT_FOUND');
    }
    const rawContent = fs.readFileSync(absolutePath, 'utf-8');
    const { data, content } = matter(rawContent);

    return {
      sha: `local-${path.basename(safePath)}`,
      metadata: data,
      content: content.trim(),
    };
  } catch (err: unknown) {
    console.error(`Error fetching content for ${safePath}:`, err);
    throw new Error(err instanceof Error ? err.message : 'FAILED_TO_FETCH_FILE');
  }
}

export async function saveContent(
  type: ContentType,
  filename: string,
  markdown: string,
  sha?: string,
  imageUpload?: PendingImageUpload
) {
  if (!(await isSessionValid())) {
    throw new Error('UNAUTHORIZED');
  }

  const safeFilename = sanitizeFilename(filename);
  const relativePath = sanitizePath(`content/${type}/${safeFilename}`, ['content/']);

  let finalMarkdown = markdown;
  let processedImage:
    | {
        buffer: Buffer;
        filename: string;
        relativePath: string;
        webPath: string;
      }
    | undefined;

  if (imageUpload) {
    const destFolder = imageUpload.destFolder || type;
    processedImage = await processUploadedImage(
      destFolder,
      imageUpload.filename,
      imageUpload.buffer
    );

    // Ensure frontmatter image field matches the exact final image path (e.g., if extension fell back)
    if (/^image:\s*"[^"]*"/m.test(finalMarkdown)) {
      finalMarkdown = finalMarkdown.replace(
        /^image:\s*"[^"]*"/m,
        `image: "${processedImage.webPath}"`
      );
    }
  }

  // Best-effort write to local disk (works in local dev; Vercel serverless fs is read-only)
  try {
    if (processedImage) {
      const imgDir = path.join(
        process.cwd(),
        'public',
        'images',
        imageUpload?.destFolder || type
      );
      if (!fs.existsSync(imgDir)) {
        fs.mkdirSync(imgDir, { recursive: true });
      }
      fs.writeFileSync(path.join(imgDir, processedImage.filename), processedImage.buffer);
    }
    const dirPath = path.join(process.cwd(), 'content', type);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, safeFilename), finalMarkdown, 'utf-8');
  } catch (err) {
    // Ignore read-only filesystem errors when running on Vercel
    if (!hasGithubPat()) {
      console.error('Error writing file locally:', err);
      throw new Error('FAILED_TO_WRITE_LOCAL_FILE');
    }
  }

  // Push to GitHub if PAT is available
  if (hasGithubPat()) {
    const action = sha && !sha.startsWith('local-') ? 'Update' : 'Create';
    const message = processedImage
      ? `CMS: ${action} ${type} content with image - ${safeFilename}`
      : `CMS: ${action} ${type} content - ${safeFilename}`;

    if (processedImage) {
      // Atomic single commit containing BOTH image and markdown (only 1 Vercel deploy!)
      const entries: MultiFileCommitEntry[] = [
        {
          path: processedImage.relativePath,
          content: processedImage.buffer.toString('base64'),
          encoding: 'base64',
        },
        {
          path: relativePath,
          content: finalMarkdown,
          encoding: 'utf-8',
        },
      ];

      try {
        const result = await commitMultipleFiles(entries, message);
        return {
          success: true,
          sha: result.fileShas[relativePath] || result.commitSha,
          imagePath: processedImage.webPath,
        };
      } catch (multiErr) {
        console.warn('Atomic commit failed, falling back to sequential commits:', multiErr);
        await commitBinaryFile(
          processedImage.relativePath,
          processedImage.buffer.toString('base64'),
          `CMS: Upload image ${processedImage.filename}`
        );
        const result = await commitFile(
          relativePath,
          finalMarkdown,
          `CMS: ${action} ${type} content - ${safeFilename}`,
          sha?.startsWith('local-') ? undefined : sha
        );
        return {
          success: true,
          sha: result.sha,
          imagePath: processedImage.webPath,
        };
      }
    }

    const result = await commitFile(
      relativePath,
      finalMarkdown,
      message,
      sha?.startsWith('local-') ? undefined : sha
    );
    return { success: true, sha: result.sha };
  }

  return {
    success: true,
    sha: `local-${safeFilename}`,
    imagePath: processedImage?.webPath,
  };
}

export async function deleteContent(filePath: string, sha: string) {
  if (!(await isSessionValid())) {
    throw new Error('UNAUTHORIZED');
  }

  const safePath = sanitizePath(filePath, ['content/']);

  try {
    const absolutePath = path.join(/*turbopackIgnore: true*/ process.cwd(), safePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    if (!hasGithubPat()) {
      console.error('Error deleting local file:', err);
      throw new Error('FAILED_TO_DELETE_LOCAL_FILE');
    }
  }

  if (hasGithubPat() && sha && !sha.startsWith('local-')) {
    const message = `CMS: Delete content file - ${safePath}`;
    await deleteFileFromRepo(safePath, sha, message);
  }

  return { success: true };
}

export async function uploadImage(type: ContentType, filename: string, buffer: Buffer) {
  if (!(await isSessionValid())) {
    throw new Error('UNAUTHORIZED');
  }

  const processed = await processUploadedImage(type, filename, buffer);

  try {
    const dirPath = path.join(process.cwd(), 'public', 'images', type);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, processed.filename), processed.buffer);
  } catch (err) {
    if (!hasGithubPat()) {
      console.error('Error writing image file locally:', err);
      throw new Error('FAILED_TO_WRITE_IMAGE');
    }
  }

  if (hasGithubPat()) {
    const message = `CMS: Upload image ${processed.filename}`;
    await commitBinaryFile(processed.relativePath, processed.buffer.toString('base64'), message);
  }

  return { success: true, path: processed.webPath };
}

export async function getApplicationsList() {
  if (!(await isSessionValid())) {
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

    return records.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (err) {
    console.error('Error fetching applications:', err);
    return [];
  }
}

export async function deleteApplication(id: string) {
  if (!(await isSessionValid())) {
    throw new Error('UNAUTHORIZED');
  }

  const safeId = sanitizeFilename(id);

  try {
    const filePath = path.join(process.cwd(), 'content', 'applications', safeId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { success: true };
  } catch (err: unknown) {
    console.error('Error deleting application:', err);
    throw new Error(err instanceof Error ? err.message : 'FAILED_TO_DELETE');
  }
}

export async function getHeroFrames() {
  if (!(await isSessionValid())) {
    throw new Error('UNAUTHORIZED');
  }

  if (hasGithubPat()) {
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
  } catch (err: unknown) {
    console.error('Error fetching local hero-frames:', err);
    throw new Error(err instanceof Error ? err.message : 'FAILED_TO_FETCH_HERO_FRAMES');
  }
}

export async function saveHeroFrames(
  frames: Array<Record<string, unknown>>,
  sha?: string,
  pendingImages?: PendingHeroImageUpload[]
) {
  if (!(await isSessionValid())) {
    throw new Error('UNAUTHORIZED');
  }

  const relativePath = 'content/hero-frames.json';
  const updatedFrames = frames.map((f) => ({ ...f }));
  const processedImages: Array<{
    index: number;
    buffer: Buffer;
    filename: string;
    relativePath: string;
    webPath: string;
  }> = [];

  if (pendingImages && pendingImages.length > 0) {
    for (const img of pendingImages) {
      const processed = await processUploadedImage('hero', img.filename, img.buffer);
      processedImages.push({ index: img.index, ...processed });
      if (updatedFrames[img.index]) {
        updatedFrames[img.index] = {
          ...updatedFrames[img.index],
          src: processed.webPath,
        };
      }
    }
  }

  const contentString = JSON.stringify(updatedFrames, null, 2);

  try {
    if (processedImages.length > 0) {
      const imgDir = path.join(process.cwd(), 'public', 'images', 'hero');
      if (!fs.existsSync(imgDir)) {
        fs.mkdirSync(imgDir, { recursive: true });
      }
      for (const img of processedImages) {
        fs.writeFileSync(path.join(imgDir, img.filename), img.buffer);
      }
    }
    const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath);
    fs.writeFileSync(filePath, contentString, 'utf-8');
  } catch (err) {
    if (!hasGithubPat()) {
      console.error('Error writing hero-frames locally:', err);
      throw new Error('FAILED_TO_WRITE_HERO_FRAMES');
    }
  }

  if (hasGithubPat()) {
    const message =
      processedImages.length > 0
        ? `CMS: Update hero frames and ${processedImages.length} image(s)`
        : 'CMS: Update hero frames configuration';

    if (processedImages.length > 0) {
      const entries: MultiFileCommitEntry[] = [
        ...processedImages.map((img) => ({
          path: img.relativePath,
          content: img.buffer.toString('base64'),
          encoding: 'base64' as const,
        })),
        {
          path: relativePath,
          content: contentString,
          encoding: 'utf-8' as const,
        },
      ];

      try {
        const result = await commitMultipleFiles(entries, message);
        return {
          success: true,
          sha: result.fileShas[relativePath] || result.commitSha,
          frames: updatedFrames,
        };
      } catch (multiErr) {
        console.warn('Atomic hero commit failed, falling back to sequential commits:', multiErr);
        for (const img of processedImages) {
          await commitBinaryFile(
            img.relativePath,
            img.buffer.toString('base64'),
            `CMS: Upload hero image ${img.filename}`
          );
        }
        const result = await commitFile(
          relativePath,
          contentString,
          'CMS: Update hero frames configuration',
          sha?.startsWith('local-') ? undefined : sha
        );
        return { success: true, sha: result.sha, frames: updatedFrames };
      }
    }

    const result = await commitFile(
      relativePath,
      contentString,
      message,
      sha?.startsWith('local-') ? undefined : sha
    );
    return { success: true, sha: result.sha, frames: updatedFrames };
  }

  return { success: true, sha: 'local-hero-frames', frames: updatedFrames };
}
