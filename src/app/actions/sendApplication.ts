'use server';

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';

export interface ApplicationData {
  fullName: string;
  email: string;
  selectedInterests: string[];
  level: string;
  department: string;
  goals: string;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendApplicationAction(data: ApplicationData) {
  const targetEmail = 'akdenizveri07@gmail.com';

  // Sanitize and trim inputs
  const rawEmail = (data.email || '').trim().slice(0, 100);
  const fullName = escapeHtml((data.fullName || '').trim().slice(0, 100));
  const level = escapeHtml((data.level || '').trim().slice(0, 50));
  const department = escapeHtml((data.department || '').trim().slice(0, 100));
  const goals = escapeHtml((data.goals || '').trim().slice(0, 5000));
  const selectedInterests = (data.selectedInterests || []).map((i) => escapeHtml(String(i).trim().slice(0, 50)));

  // Email validation check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!rawEmail || !emailRegex.test(rawEmail)) {
    return {
      success: false,
      error: 'Lütfen geçerli bir e-posta adresi giriniz.'
    };
  }

  // Rate limiting: Max 3 submissions per minute per user/IP
  const rateKey = await getClientIdentifier(`app_${rawEmail}`);
  const rateCheck = checkRateLimit(rateKey, 3, 60 * 1000);

  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `Çok fazla başvuru denemesi yaptınız. Lütfen ${rateCheck.retryAfterSeconds} saniye bekledikten sonra tekrar deneyiniz.`
    };
  }

  // 1. Save local record in content/applications/
  try {
    const dirPath = path.join(process.cwd(), 'content', 'applications');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = (fullName || 'anonim')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const filename = `${timestamp}-${safeName || 'basvuru'}.json`;
    const record = {
      targetEmail,
      submittedAt: new Date().toISOString(),
      fullName,
      email: rawEmail,
      selectedInterests,
      level,
      department,
      goals,
    };

    fs.writeFileSync(path.join(dirPath, filename), JSON.stringify(record, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving application locally:', err);
  }

  // 2. Prepare Email Text & HTML
  const subject = `[AVBT Üyelik Başvurusu] - ${fullName || 'Yeni Üye'}`;

  const textContent = `
AKDENİZ VERİ BİLİMİ TOPLULUĞU - YENİ ÜYELİK BAŞVURUSU
==================================================
Ad Soyad: ${fullName || 'Belirtilmedi'}
E-posta: ${rawEmail || 'Belirtilmedi'}
Tarih: ${new Date().toLocaleDateString('tr-TR')}

İlgi Alanları:
${selectedInterests.length ? selectedInterests.map((i) => `- ${i}`).join('\n') : '- Seçim yapılmadı'}

Teknik Seviye: ${level || 'Belirtilmedi'}
Departman: ${department || 'Belirtilmedi'}

Hedefler & Proje Fikirleri:
${goals || 'Belirtilmedi'}
==================================================`;

  const htmlContent = `
    <div style="font-family: system-ui, sans-serif; background-color: #090d16; color: #e2e8f0; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00f2fe; margin-top: 0; margin-bottom: 16px; font-size: 20px;">Akdeniz Veri Bilimi Topluluğu — Üyelik Başvurusu</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; width: 140px;">Ad Soyad:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-weight: bold;">${fullName}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">E-posta:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #00f2fe;"><a href="mailto:${rawEmail}" style="color: #00f2fe;">${rawEmail}</a></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Tarih:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff;">${new Date().toLocaleDateString('tr-TR')}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">İlgi Alanları:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #00f5a0;">${selectedInterests.join(', ') || 'Seçim yapılmadı'}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Teknik Seviye:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff;">${level}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Departman:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff;">${department}</td></tr>
      </table>
      <div style="background-color: #111624; padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #00f2fe; margin-top: 0; font-size: 14px;">Hedefler & Proje Fikirleri:</h4>
        <p style="white-space: pre-wrap; margin-bottom: 0; font-size: 13px; color: #cbd5e1;">${goals || 'Belirtilmedi'}</p>
      </div>
    </div>
  `;

  // 3. Send email via Nodemailer SMTP if credentials provided
  const rawPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const cleanPass = rawPass ? rawPass.replace(/\s+/g, '') : '';
  const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER || 'akdenizveri07@gmail.com';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

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
        from: `"Akdeniz Veri Bilimi Topluluğu" <${smtpUser}>`,
        to: targetEmail,
        replyTo: rawEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ E-posta ${targetEmail} adresine başarıyla gönderildi.`);
      return { success: true, method: 'smtp' };
    } catch (err: any) {
      console.error('Nodemailer SMTP Error:', err);
    }
  }

  return { success: true, method: 'recorded' };
}
