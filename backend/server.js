import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/apiRoutes.js';
import { initDb } from './src/config/db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // In production, replace with specific frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'LPK Backend Server is running smoothly' });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.'
  });
});

// Initialize DB and then start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` LPK Jepang Backend Server Running on Port: ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
    console.log(`==================================================`);
  });
}).catch(err => {
  console.error("❌ Failed to start server due to database initialization failure:", err);
  process.exit(1);
});
