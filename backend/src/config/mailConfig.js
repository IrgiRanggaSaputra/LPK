import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// Verify SMTP connection
export const verifyMailConnection = async () => {
  // Check if SMTP is configured, if not log a warning instead of breaking
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_USER === 'your_email@gmail.com') {
    console.warn('⚠️ Warning: SMTP credentials are not configured in .env. Email notifications will be skipped or simulated.');
    return false;
  }
  try {
    await transporter.verify();
    console.log('✅ SMTP Mail server connection verified successfully.');
    return true;
  } catch (error) {
    console.error('❌ SMTP Mail server connection failed:', error.message);
    return false;
  }
};

export default transporter;
