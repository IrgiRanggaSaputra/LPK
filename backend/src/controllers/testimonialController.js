import { getDb } from '../config/db.js';

/**
 * Get all testimonials
 */
export const getAllTestimonials = async (req, res, next) => {
  try {
    const db = getDb();
    const [list] = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    
    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single testimonial
 */
export const getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [id]);
    const testimonial = rows[0];

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan.'
      });
    }

    return res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new testimonial
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const { name, city, program, quote, avatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama wajib diisi.' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'Kota asal / penempatan wajib diisi.' });
    }
    if (!program || !program.trim()) {
      return res.status(400).json({ success: false, message: 'Program/Tahun magang wajib diisi.' });
    }
    if (!quote || !quote.trim()) {
      return res.status(400).json({ success: false, message: 'Isi testimoni wajib diisi.' });
    }

    let finalAvatar = avatar && avatar.trim() ? avatar.trim() : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150';

    // If an avatar file was uploaded
    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, '/');
      const baseUrl = process.env.BASE_URL !== undefined ? process.env.BASE_URL : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
      finalAvatar = baseUrl ? `${baseUrl}/${filePath}` : `/${filePath}`;
    }

    const db = getDb();
    const [result] = await db.execute(
      `INSERT INTO testimonials (name, city, program, quote, avatar) VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), city.trim(), program.trim(), quote.trim(), finalAvatar]
    );

    return res.status(201).json({
      success: true,
      message: 'Testimoni berhasil ditambahkan!',
      data: {
        id: result.insertId,
        name: name.trim(),
        city: city.trim(),
        program: program.trim(),
        quote: quote.trim(),
        avatar: finalAvatar
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing testimonial
 */
export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, city, program, quote, avatar } = req.body;

    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [id]);
    const testimonial = rows[0];

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan.'
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama wajib diisi.' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'Kota asal / penempatan wajib diisi.' });
    }
    if (!program || !program.trim()) {
      return res.status(400).json({ success: false, message: 'Program/Tahun magang wajib diisi.' });
    }
    if (!quote || !quote.trim()) {
      return res.status(400).json({ success: false, message: 'Isi testimoni wajib diisi.' });
    }

    let finalAvatar = avatar && avatar.trim() ? avatar.trim() : testimonial.avatar;

    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, '/');
      const baseUrl = process.env.BASE_URL !== undefined ? process.env.BASE_URL : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
      finalAvatar = baseUrl ? `${baseUrl}/${filePath}` : `/${filePath}`;
    }

    await db.execute(
      `UPDATE testimonials SET name = ?, city = ?, program = ?, quote = ?, avatar = ? WHERE id = ?`,
      [name.trim(), city.trim(), program.trim(), quote.trim(), finalAvatar, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Testimoni berhasil diperbarui!',
      data: {
        id: parseInt(id),
        name: name.trim(),
        city: city.trim(),
        program: program.trim(),
        quote: quote.trim(),
        avatar: finalAvatar
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a testimonial
 */
export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const [rows] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [id]);
    const testimonial = rows[0];

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan.'
      });
    }

    await db.execute('DELETE FROM testimonials WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Testimoni berhasil dihapus!'
    });
  } catch (error) {
    next(error);
  }
};
