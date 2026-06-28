// Utility to construct full URL for uploaded files (avatars, service images).
// In development, Vite proxy forwards /uploads to localhost:5000.
// In production, we need the full Render backend URL.
const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

export const getUploadUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${UPLOADS_BASE}/uploads/${path}`;
};

export const getAvatarUrl = (avatarFilename, fallbackName = 'User') => {
  if (avatarFilename) {
    if (avatarFilename.startsWith('http')) return avatarFilename;
    return `${UPLOADS_BASE}/uploads/avatars/${avatarFilename}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=0D9488&color=fff`;
};

export const getServiceImageUrl = (imageFilename) => {
  if (!imageFilename) return '';
  if (imageFilename.startsWith('http')) return imageFilename;
  return `${UPLOADS_BASE}/uploads/services/${imageFilename}`;
};

export const getCategoryImageUrl = (imageFilename) => {
  if (!imageFilename) return '';
  if (imageFilename.startsWith('http')) return imageFilename;
  return `${UPLOADS_BASE}/uploads/categories/${imageFilename}`;
};
