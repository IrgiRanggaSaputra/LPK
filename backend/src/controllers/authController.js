import { getDb, hashPassword } from '../config/db.js';
import crypto from 'crypto';

/**
 * Handle admin login request by checking credentials in the database.
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1. Validation
    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, message: 'Username wajib diisi.' });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ success: false, message: 'Password wajib diisi.' });
    }

    // 2. Query user from database
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username.trim()]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah.'
      });
    }

    // 3. Match passwords using SHA-256 hash comparison
    const inputHashedPassword = hashPassword(password.trim());

    if (inputHashedPassword === user.password) {
      // 4. Generate dynamic session token
      const sessionToken = crypto.randomBytes(32).toString('hex');

      // 5. Save the token to the user record in database
      await db.execute('UPDATE users SET token = ? WHERE id = ?', [sessionToken, user.id]);

      return res.status(200).json({
        success: true,
        message: 'Login sukses! Dialihkan...',
        token: sessionToken
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah.'
      });
    }

  } catch (error) {
    next(error);
  }
};
