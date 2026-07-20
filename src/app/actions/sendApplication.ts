'use server';

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
    const filePath = path.join(dirPath, filename);

    const record = {
      targetEmail: 'akdenizveri07@gmail.com',
      submittedAt: new Date().toISOString(),
      ...data,
    };

    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8');

    return { success: true };
  } catch (err: any) {
    console.error('Error saving application:', err);
    return { success: false, error: err.message || 'Gönderim sırasında hata oluştu' };
  }
}
