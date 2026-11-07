import { getDb } from '../config/db.js';

/**
 * Get all news articles
 */
export const getAllNews = async (req, res, next) => {
  try {
    const db = getDb();
    const [list] = await db.query('SELECT * FROM news ORDER BY created_at DESC');
    
    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single news details
 */
export const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [id]);
    const article = rows[0];

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel berita tidak ditemukan.'
      });
    }

    return res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new news article
 */
export const createNews = async (req, res, next) => {
  try {
    const { title, content, category, image_url } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Judul berita wajib diisi.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Konten berita wajib diisi.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Kategori berita wajib dipilih.' });
    }
    
    let cleanImageUrl = image_url && image_url.trim() ? image_url.trim() : 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=600';
    
    // If a file was uploaded, use its path
    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, '/');
      const baseUrl = process.env.BASE_URL !== undefined ? process.env.BASE_URL : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
      cleanImageUrl = baseUrl ? `${baseUrl}/${filePath}` : `/${filePath}`;
    }

    const db = getDb();
    const [result] = await db.execute(
      `INSERT INTO news (title, content, category, image_url) VALUES (?, ?, ?, ?)`,
      [title.trim(), content.trim(), category.trim(), cleanImageUrl]
    );

    return res.status(201).json({
      success: true,
      message: 'Berita berhasil diterbitkan!',
      data: {
        id: result.insertId,
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        image_url: cleanImageUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing news article
 */
export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, image_url } = req.body;

    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [id]);
    const article = rows[0];

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel berita tidak ditemukan.'
      });
    }

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Judul berita wajib diisi.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Konten berita wajib diisi.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Kategori berita wajib dipilih.' });
    }

    let cleanImageUrl = image_url && image_url.trim() ? image_url.trim() : article.image_url;

    // If a file was uploaded, use its path
    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, '/');
      const baseUrl = process.env.BASE_URL !== undefined ? process.env.BASE_URL : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
      cleanImageUrl = baseUrl ? `${baseUrl}/${filePath}` : `/${filePath}`;
    }

    await db.execute(
      `UPDATE news SET title = ?, content = ?, category = ?, image_url = ? WHERE id = ?`,
      [title.trim(), content.trim(), category.trim(), cleanImageUrl, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Berita berhasil diperbarui!',
      data: {
        id: parseInt(id),
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        image_url: cleanImageUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a news article
 */
export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [id]);
    const article = rows[0];
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel berita tidak ditemukan.'
      });
    }

    await db.execute('DELETE FROM news WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Berita berhasil dihapus!'
    });
  } catch (error) {
    next(error);
  }
};
