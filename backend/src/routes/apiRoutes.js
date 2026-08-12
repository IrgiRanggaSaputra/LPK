import express from 'express';
import { 
  register, 
  getRegistrations, 
  exportCsv 
} from '../controllers/pendaftaranController.js';
import { 
  getAllNews, 
  getNewsById, 
  createNews, 
  updateNews, 
  deleteNews 
} from '../controllers/beritaController.js';
import { 
  getAllTestimonials, 
  getTestimonialById, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonialController.js';
import { login } from '../controllers/authController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Define multer fields upload
const fieldsUpload = upload.fields([
  { name: 'ijazah_photo', maxCount: 1 },
  { name: 'sim_a_photo', maxCount: 1 },
  { name: 'certificate_photo', maxCount: 1 }
]);

/* ==========================================
   PUBLIC VISITOR ROUTES
   ========================================== */
router.post('/daftar', fieldsUpload, register);       // Submit registration with files
router.get('/berita', getAllNews);                    // Get all news
router.get('/berita/:id', getNewsById);               // Get single news
router.get('/testimoni', getAllTestimonials);          // Get all testimonials
router.get('/testimoni/:id', getTestimonialById);      // Get single testimonial

/* ==========================================
   AUTHENTICATION ROUTES
   ========================================== */
router.post('/auth/login', login);                    // Admin login

/* ==========================================
   PROTECTED ADMIN DASHBOARD ROUTES
   ========================================== */
router.get('/pendaftar', requireAdminAuth, getRegistrations);
router.get('/pendaftar/export/csv', requireAdminAuth, exportCsv); // Download CSV file
router.post('/berita', requireAdminAuth, upload.single('news_image'), createNews);
router.put('/berita/:id', requireAdminAuth, upload.single('news_image'), updateNews);
router.delete('/berita/:id', requireAdminAuth, deleteNews);

router.post('/testimoni', requireAdminAuth, upload.single('avatar_image'), createTestimonial);
router.put('/testimoni/:id', requireAdminAuth, upload.single('avatar_image'), updateTestimonial);
router.delete('/testimoni/:id', requireAdminAuth, deleteTestimonial);

export default router;
