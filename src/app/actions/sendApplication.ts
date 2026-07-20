'use server';

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface ApplicationData {
  fullName: string;
  email: string;
  selectedInterests: string[];
  level: string;
  department: string;
  goals: string;
}

export async function sendApplicationAction(data: ApplicationData) {
  const targetEmail = 'akdenizveri07@gmail.com';

  // 1. Always save a local record in content/applications/ so no submission is ever lost
  try {
    const dirPath = path.join(process.cwd(), 'content', 'applications');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = (data.fullName || 'anonim')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const filename = `${timestamp}-${safeName || 'basvuru'}.json`;
    const record = {
      targetEmail,
      submittedAt: new Date().toISOString(),
      ...data,
    };

    fs.writeFileSync(path.join(dirPath, filename), JSON.stringify(record, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving application locally:', err);
  }

  // 2. Prepare Email Text & HTML
  const subject = `[AVBT Üyelik Başvurusu] - ${data.fullName || 'Yeni Üye'}`;

  const textContent = `
AKDENİZ VERİ BİLİMİ TOPLULUĞU - YENİ ÜYELİK BAŞVURUSU
==================================================
Ad Soyad: ${data.fullName || 'Belirtilmedi'}
E-posta: ${data.email || 'Belirtilmedi'}
Tarih: ${new Date().toLocaleDateString('tr-TR')}

İlgi Alanları:
${data.selectedInterests?.length ? data.selectedInterests.map((i) => `- ${i}`).join('\n') : '- Seçim yapılmadı'}

Teknik Seviye: ${data.level || 'Belirtilmedi'}
Departman: ${data.department || 'Belirtilmedi'}

Hedefler & Proje Fikirleri:
${data.goals || 'Belirtilmedi'}
==================================================`;

  const htmlContent = `
    <div style="font-family: system-ui, sans-serif; background-color: #090d16; color: #e2e8f0; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00f2fe; margin-top: 0; margin-bottom: 16px; font-size: 20px;">Akdeniz Veri Bilimi Topluluğu — Üyelik Başvurusu</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; width: 140px;">Ad Soyad:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-weight: bold;">${data.fullName}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">E-posta:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #00f2fe;"><a href="mailto:${data.email}" style="color: #00f2fe;">${data.email}</a></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Tarih:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff;">${new Date().toLocaleDateString('tr-TR')}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">İlgi Alanları:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #00f5a0;">${data.selectedInterests?.join(', ') || 'Seçim yapılmadı'}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Teknik Seviye:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff;">${data.level}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Departman:</td><td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff;">${data.department}</td></tr>
      </table>
      <div style="background-color: #111624; padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #00f2fe; margin-top: 0; font-size: 14px;">Hedefler & Proje Fikirleri:</h4>
        <p style="white-space: pre-wrap; margin-bottom: 0; font-size: 13px; color: #cbd5e1;">${data.goals || 'Belirtilmedi'}</p>
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
        replyTo: data.email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ E-posta ${targetEmail} adresine başarıyla gönderildi.`);
      return { success: true, method: 'smtp' };
    } catch (err: any) {
      console.error('Nodemailer SMTP Error:', err);
    }
  } else {
    console.log('---------------------------------------------------------');
    console.log('📌 YENİ BAŞVURU ALINDI VE SUNUCUYA KAYDEDİLDİ:');
    console.log(`- Ad Soyad: ${data.fullName}`);
    console.log(`- E-posta: ${data.email}`);
    console.log(`- Departman: ${data.department}`);
    console.log(`- Kayıt Yeri: content/applications/`);
    console.log('💡 Gmail adresinize e-posta gelmesi için .env.local dosyasına GMAIL_APP_PASSWORD ekleyin.');
    console.log('---------------------------------------------------------');
  }

  return { success: true, method: 'recorded' };
}
