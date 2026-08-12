import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

let dbPool = null;

/**
 * SHA-256 Hashing Helper for passwords.
 */
export const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Initializes MySQL connection pool and creates schema tables.
 */
export const initDb = async () => {
  try {
    dbPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'lpk',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the database connection
    const connection = await dbPool.getConnection();
    console.log(`✅ MySQL Database Connected successfully to: ${process.env.DB_NAME || 'lpk'}`);
    connection.release();

    // Check if the old structure exists, if so rebuild it for advanced form fields
    let rebuildRegistrations = false;
    try {
      // Test if new field 'gender' exists in registrations
      await dbPool.query("SELECT gender FROM registrations LIMIT 1");
    } catch (err) {
      rebuildRegistrations = true;
    }

    if (rebuildRegistrations) {
      console.log('🔄 Rebuilding registrations table schema with advanced fields...');
      await dbPool.query("DROP TABLE IF EXISTS registrations");
    }

    // Setup tables
    await createTables();

    return dbPool;
  } catch (error) {
    console.error('❌ MySQL Connection failed:', error.message);
    throw error;
  }
};

/**
 * Checks and creates the required database tables dynamically.
 */
const createTables = async () => {
  // Users table schema
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      token VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // Registrations table schema
  const registrationsTable = `
    CREATE TABLE IF NOT EXISTS registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(50) NOT NULL,
      gender VARCHAR(20) NOT NULL,
      birth_place_date VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      marital_status VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      height INT NOT NULL,
      weight INT NOT NULL,
      has_tattoo VARCHAR(10) NOT NULL,
      last_education VARCHAR(100) NOT NULL,
      major VARCHAR(100) NOT NULL,
      ijazah_photo VARCHAR(255),
      joining_purpose TEXT NOT NULL,
      has_sim_a VARCHAR(10) NOT NULL,
      sim_a_photo VARCHAR(255),
      studied_japanese VARCHAR(255) NOT NULL,
      has_certificate VARCHAR(255) NOT NULL,
      certificate_photo VARCHAR(255),
      japanese_level VARCHAR(50) NOT NULL,
      desired_job VARCHAR(100) NOT NULL,
      japan_reason TEXT NOT NULL,
      lpk_info_source VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  // News table schema
  const newsTable = `
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  try {
    await dbPool.query(usersTable);
    await dbPool.query(registrationsTable);
    await dbPool.query(newsTable);
    console.log('✅ MySQL tables checked and verified.');

    // Seed default admin user if users table is empty
    const [usersCount] = await dbPool.query('SELECT COUNT(*) as count FROM users');
    if (usersCount[0].count === 0) {
      console.log('📝 Seeding default admin user into MySQL...');
      const defaultUser = process.env.ADMIN_USERNAME || 'admin';
      const defaultPass = process.env.ADMIN_PASSWORD || 'lpkadmin123';
      const hashedPass = hashPassword(defaultPass);
      
      await dbPool.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [defaultUser, hashedPass]
      );
      console.log('✅ Default admin user seeded successfully in database.');
    }

    // Seed dummy news if the table is empty
    const [rows] = await dbPool.query('SELECT COUNT(*) as count FROM news');
    if (rows[0].count === 0) {
      console.log('📝 Seeding initial news data into MySQL...');
      
      const sampleNews = [
        {
          title: "Tips Lolos Wawancara Kerja (Mensetsu) Perusahaan Jepang",
          content: "Wawancara kerja atau Mensetsu adalah tahapan paling krusial dalam proses kerja ke Jepang. LPK kami melatih Anda teknik menjawab pertanyaan user Jepang secara percaya diri, teknik Ojigi (membungkuk hormat) yang benar, serta sikap tubuh yang menunjukkan kedisplinan tinggi. Kunci utama mensetsu adalah senyuman hangat dan kejujuran.",
          category: "Tips & Trik",
          image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop"
        },
        {
          title: "Pelepasan 15 Alumni LPK Jepang Program Tokutei Ginou Kaigo ke Osaka",
          content: "Hari ini LPK secara resmi melepas keberangkatan 15 alumni perawat lansia (Kaigo) yang akan ditempatkan di Osaka. Kontrak kerja berjalan selama 5 tahun dengan fasilitas tempat tinggal lengkap dan gaji standar UMR Jepang. Selamat bertugas bagi rekan-rekan semua!",
          category: "Pemberitahuan",
          image_url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop"
        }
      ];

      for (const item of sampleNews) {
        await dbPool.query(
          `INSERT INTO news (title, content, category, image_url) VALUES (?, ?, ?, ?)`,
          [item.title, item.content, item.category, item.image_url]
        );
      }
      console.log('✅ MySQL seeding complete.');
    }
  } catch (error) {
    console.error('❌ Failed to verify/create tables in MySQL:', error.message);
    throw error;
  }
};

/**
 * Returns active database connection pool.
 */
export const getDb = () => {
  if (!dbPool) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return dbPool;
};
