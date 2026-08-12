import { getDb } from '../config/db.js';

/**
 * Middleware to protect admin endpoints by checking for the Bearer token in the database.
 */
export const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token otorisasi tidak ditemukan.'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Query MySQL users table to find active session matching token
    const db = getDb();
    const [rows] = await db.execute('SELECT id, username FROM users WHERE token = ?', [token]);
    const user = rows[0];

    if (user) {
      req.user = user; // Attach authenticated user details to request object
      next(); // Proceed to next handler
    } else {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Sesi tidak valid atau telah berakhir.'
      });
    }
  } catch (error) {
    console.error('Auth middleware database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan sistem pada otorisasi pendaftaran.'
    });
  }
};
