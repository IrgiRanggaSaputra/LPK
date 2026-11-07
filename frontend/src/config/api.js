/**
 * Centralized API configuration for local development & Docker production.
 *
 * In production/Docker with Nginx, API_BASE_URL defaults to '' (relative path),
 * so all calls like /api/berita and /uploads/... are reverse-proxied by Nginx.
 * In development (vite dev), it falls back to http://localhost:5000.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? 'http://localhost:5000' : '');

/**
 * Normalizes uploaded media/file URLs for consistent rendering.
 * Converts legacy 'http://localhost:5000/uploads/...' from the database
 * into a valid URL matching the current deployment host.
 */
export const getMediaUrl = (urlOrPath) => {
  if (!urlOrPath) return '';
  
  // If it's an external URL (e.g. Unsplash)
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    if (urlOrPath.includes('localhost:5000')) {
      const relativePart = urlOrPath.replace(/^https?:\/\/localhost:5000\/?/, '');
      return API_BASE_URL ? `${API_BASE_URL}/${relativePart}` : `/${relativePart}`;
    }
    return urlOrPath;
  }

  // Relative path (e.g. 'uploads/file.png' or '/uploads/file.png')
  const cleanPath = urlOrPath.replace(/^\//, '');
  return API_BASE_URL ? `${API_BASE_URL}/${cleanPath}` : `/${cleanPath}`;
};

