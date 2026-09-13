const API_URL =
  import.meta.env.VITE_API_URL || 'https://smcclub-1.onrender.com';

export const getImageUrl = (image) => {
  if (!image) return '';

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return `${API_URL}${image.startsWith('/') ? image : `/${image}`}`;
};