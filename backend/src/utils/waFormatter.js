import dotenv from 'dotenv';
dotenv.config();

/**
 * Generates a WhatsApp click-to-chat URL filled with formatted registration info.
 * @param {Object} data Registration data
 * @param {string} data.name Full name of candidate
 * @param {number|string} data.age Age of candidate
 * @param {string} data.whatsapp Candidate's whatsapp number
 * @param {string} data.program Selected program name
 * @returns {string} Fully encoded URL
 */
export const generateWaUrl = (data) => {
  const { name, age, whatsapp, program } = data;
  const adminWa = process.env.ADMIN_WA_NUMBER || '6281234567890';
  
  const message = `Halo Admin LPK Jepang! 👋\n\n` +
    `Saya ingin mendaftar ke LPK. Berikut adalah data diri saya:\n` +
    `• *Nama Lengkap*: ${name}\n` +
    `• *Usia*: ${age} Tahun\n` +
    `• *No. WhatsApp*: ${whatsapp}\n` +
    `• *Program Pilihan*: ${program}\n\n` +
    `Mohon info mengenai tahapan selanjutnya dan berkas yang harus saya persiapkan. Terima kasih! 🇯🇵✨`;

  const encodedMessage = encodeURIComponent(message);
  
  // Sanitize the phone number
  const cleanAdminWa = adminWa.replace(/[^0-9]/g, '');

  return `https://api.whatsapp.com/send?phone=${cleanAdminWa}&text=${encodedMessage}`;
};
