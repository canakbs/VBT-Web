import { headers } from 'next/headers';

// In-memory rate limiting map: key -> timestamps array
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(key: string, limit = 3, windowMs = 60 * 1000): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) || []).filter((ts) => now - ts < windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return { allowed: true };
}

export async function getClientIdentifier(suffix = ''): Promise<string> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : headerList.get('x-real-ip') || '127.0.0.1';
    return `${ip}_${suffix}`;
  } catch (e) {
    return `local_${suffix}`;
  }
}
