import transporter from '../config/mailConfig.js';
import { generateWaUrl } from '../utils/waFormatter.js';
import { getDb } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Handle advanced candidate registration and file uploads.
 */
export const register = async (req, res, next) => {
  try {
    // 1. Extract non-file text parameters
    const {
      name, whatsapp, gender, birth_place_date, age, marital_status, address,
      height, weight, has_tattoo, last_education, major, joining_purpose,
      has_sim_a, studied_japanese, has_certificate, japanese_level,
      desired_job, japan_reason, lpk_info_source
    } = req.body;

    // 2. Validate mandatory fields
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Nama lengkap wajib diisi.' });
    if (!whatsapp || !whatsapp.trim()) return res.status(400).json({ success: false, message: 'Nomor WhatsApp wajib diisi.' });
    if (!gender) return res.status(400).json({ success: false, message: 'Jenis kelamin wajib dipilih.' });
    if (!birth_place_date || !birth_place_date.trim()) return res.status(400).json({ success: false, message: 'Tempat tanggal lahir wajib diisi.' });
    if (!age || isNaN(age)) return res.status(400).json({ success: false, message: 'Usia wajib diisi dengan angka.' });
    if (!marital_status) return res.status(400).json({ success: false, message: 'Status perkawinan wajib dipilih.' });
    if (!address || !address.trim()) return res.status(400).json({ success: false, message: 'Alamat rumah wajib diisi.' });
    if (!height || isNaN(height)) return res.status(400).json({ success: false, message: 'Tinggi badan wajib diisi dengan angka.' });
    if (!weight || isNaN(weight)) return res.status(400).json({ success: false, message: 'Berat badan wajib diisi dengan angka.' });
    if (!has_tattoo) return res.status(400).json({ success: false, message: 'Pernyataan tato wajib diisi.' });
    if (!last_education) return res.status(400).json({ success: false, message: 'Pendidikan terakhir wajib dipilih.' });
    if (!major || !major.trim()) return res.status(400).json({ success: false, message: 'Jurusan pendidikan wajib diisi.' });
    if (!joining_purpose || !joining_purpose.trim()) return res.status(400).json({ success: false, message: 'Tujuan bergabung wajib diisi.' });
    if (!has_sim_a) return res.status(400).json({ success: false, message: 'Pernyataan kepemilikan SIM A wajib diisi.' });
    if (!studied_japanese) return res.status(400).json({ success: false, message: 'Pernyataan belajar bahasa Jepang wajib diisi.' });
    if (!has_certificate) return res.status(400).json({ success: false, message: 'Pernyataan sertifikat wajib diisi.' });
    if (!japanese_level) return res.status(400).json({ success: false, message: 'Level bahasa Jepang wajib dipilih.' });
    if (!desired_job || !desired_job.trim()) return res.status(400).json({ success: false, message: 'Job yang diinginkan wajib diisi.' });
    if (!japan_reason || !japan_reason.trim()) return res.status(400).json({ success: false, message: 'Alasan ke Jepang wajib diisi.' });
    if (!lpk_info_source) return res.status(400).json({ success: false, message: 'Informasi sumber LPK wajib diisi.' });

    // 3. Extract uploaded files paths (saved on server)
    const files = req.files || {};
    const ijazah_photo = files['ijazah_photo'] ? files['ijazah_photo'][0].path.replace(/\\/g, '/') : null;
    const sim_a_photo = files['sim_a_photo'] ? files['sim_a_photo'][0].path.replace(/\\/g, '/') : null;
    const certificate_photo = files['certificate_photo'] ? files['certificate_photo'][0].path.replace(/\\/g, '/') : null;

    // Validate if ijazah upload is missing
    if (!ijazah_photo) {
      return res.status(400).json({ success: false, message: 'Upload foto Ijazah Terakhir wajib diunggah.' });
    }

    const payload = [
      name.trim(), whatsapp.trim(), gender, birth_place_date.trim(), parseInt(age),
      marital_status, address.trim(), parseInt(height), parseInt(weight), has_tattoo,
      last_education, major.trim(), ijazah_photo, joining_purpose.trim(), has_sim_a,
      sim_a_photo, studied_japanese.trim(), has_certificate, certificate_photo,
      japanese_level, desired_job.trim(), japan_reason.trim(), lpk_info_source
    ];

    // 4. Save to Database
    const db = getDb();
    const [result] = await db.execute(`
      INSERT INTO registrations (
        name, whatsapp, gender, birth_place_date, age, marital_status, address,
        height, weight, has_tattoo, last_education, major, ijazah_photo, joining_purpose,
        has_sim_a, sim_a_photo, studied_japanese, has_certificate, certificate_photo,
        japanese_level, desired_job, japan_reason, lpk_info_source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, payload);

    const registrationId = result.insertId;

    // 5. Generate WA link (uses simple info: name, age, whatsapp, desired_job)
    const waUrl = generateWaUrl({
      name: name.trim(),
      age: parseInt(age),
      whatsapp: whatsapp.trim(),
      program: desired_job.trim()
    });

    // 6. Send notification Email to admin
    const isSmtpConfigured = process.env.SMTP_USER && 
                             process.env.SMTP_PASS && 
                             process.env.SMTP_USER !== 'your_email@gmail.com';
    
    if (isSmtpConfigured) {
      try {
        const mailOptions = {
          from: `"Sistem LPK" <${process.env.SMTP_USER}>`,
          to: process.env.ADMIN_EMAIL || 'admin_lpk@example.com',
          subject: `🇯🇵 Registrasi Lengkap Baru: ${name.trim()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e0e0e0; padding: 25px; border-radius: 8px;">
              <h2 style="color: #0F2C59; border-bottom: 2px solid #D80032; padding-bottom: 10px;">Formulir Pendaftaran Lengkap</h2>
              <p>Telah masuk data pendaftaran lengkap calon magang Jepang baru dari website:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Nama Lengkap</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">WhatsApp</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${whatsapp}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Usia / JK</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${age} Tahun / ${gender}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Pendidikan / Jurusan</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${last_education} (${major})</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Job Yang Diinginkan</td>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #D80032;">${desired_job}</td>
                </tr>
              </table>
              <p style="margin-top: 15px;">
                Buka panel admin LPK di <a href="http://localhost:3000/admin" target="_blank">Dashboard Admin</a> untuk melihat berkas unggahan dan resume lengkap.
              </p>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error('⚠️ Failed to send detail email:', err.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil disimpan ke database!',
      id: registrationId,
      waUrl
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all registrations from MySQL (Admin panel).
 */
export const getRegistrations = async (req, res, next) => {
  try {
    const db = getDb();
    const [list] = await db.query('SELECT * FROM registrations ORDER BY created_at DESC');
    
    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export registrations list as CSV file.
 */
export const exportCsv = async (req, res, next) => {
  try {
    const db = getDb();
    const [list] = await db.query('SELECT * FROM registrations ORDER BY created_at DESC');

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      let str = String(val).replace(/\r?\n/g, ' '); // remove line breaks
      str = str.replace(/"/g, '""'); // escape double quotes
      return `"${str}"`;
    };

    const headers = [
      "ID", "Nama Lengkap", "WhatsApp", "Jenis Kelamin", "Tempat Tanggal Lahir", "Usia",
      "Status Pernikahan", "Alamat Rumah", "Tinggi Badan", "Berat Badan", "Ada Tato",
      "Pendidikan Terakhir", "Jurusan", "File Ijazah", "Tujuan Bergabung", "Punya SIM A",
      "File SIM A", "Pernah Belajar JP", "Punya Sertifikat", "File Sertifikat",
      "Level Bahasa JP", "Job Diinginkan", "Alasan Ke Jepang", "Sumber Info", "Tanggal Terdaftar"
    ];

    let csvContent = headers.join(',') + '\n';

    for (const item of list) {
      const row = [
        item.id,
        escapeCsv(item.name),
        escapeCsv(item.whatsapp),
        escapeCsv(item.gender),
        escapeCsv(item.birth_place_date),
        item.age,
        escapeCsv(item.marital_status),
        escapeCsv(item.address),
        item.height,
        item.weight,
        escapeCsv(item.has_tattoo),
        escapeCsv(item.last_education),
        escapeCsv(item.major),
        escapeCsv(item.ijazah_photo ? `http://localhost:5000/${item.ijazah_photo}` : ''),
        escapeCsv(item.joining_purpose),
        escapeCsv(item.has_sim_a),
        escapeCsv(item.sim_a_photo ? `http://localhost:5000/${item.sim_a_photo}` : ''),
        escapeCsv(item.studied_japanese),
        escapeCsv(item.has_certificate),
        escapeCsv(item.certificate_photo ? `http://localhost:5000/${item.certificate_photo}` : ''),
        escapeCsv(item.japanese_level),
        escapeCsv(item.desired_job),
        escapeCsv(item.japan_reason),
        escapeCsv(item.lpk_info_source),
        item.created_at
      ];
      csvContent += row.join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=laporan_pendaftar_lpk.csv');
    return res.status(200).send(csvContent);

  } catch (error) {
    next(error);
  }
};
