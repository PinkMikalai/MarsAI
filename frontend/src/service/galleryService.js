import api from './api';

const getOrigin = () => (import.meta.env.VITE_API_URL || 'http://localhost:3000/marsai').replace(/\/marsai\/?$/, '');

const buildUploadUrl = (value, folder) => {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;
  const origin = getOrigin();
  const clean = value.replace(/^\//, '');
  const path = clean.includes('assets/uploads') ? clean : `assets/uploads/${folder}/${clean}`;
  return `${origin}/${path}`;
};

export const videoApi = {
  getAllVideos: async () => {
    const data = await api('/videos', { method: 'GET' });
    return data;
  },

  searchVideos: async (searchQuery) => {
    const data = await api(`/videos?q=${encodeURIComponent(searchQuery.trim())}`, { method: 'GET' });
    return data;
  },

  getVideoById: async (videoId) => {
    const data = await api(`/videos/${videoId}`, { method: 'GET' });
    return data;
  },

  getVideoTags: async (videoId) => {
    try {
      const data = await api(`/videos/${videoId}`, { method: 'GET' });
      return data?.tags || [];
    } catch {
      return [];
    }
  },
};

export const getCoverUrl = (cover) => buildUploadUrl(cover, 'images');
export const getVideoUrl = (videoFileName) => buildUploadUrl(videoFileName, 'videos');
