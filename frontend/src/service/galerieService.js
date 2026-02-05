
import api from './api';


export const videosService = {
  getAllVideos: async () => {
    try {
      const response = await api.get('/videos');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos:', error);
      throw error;
    }
  },
  
  getVideoTags: async (videoId) => {
    try {
      const response = await api.get(`/videos/${videoId}`);
      return response.data?.tags || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des tags pour la vidéo ${videoId}:`, error);
      return [];
    }
  },
  
  getVideoById: async (videoId) => {
    try {
      const response = await api.get(`/videos/${videoId}`);
      return {
        video: response.data?.video || null,
        tags: response.data?.tags || []
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération de la vidéo ${videoId}:`, error);
      throw error;
    }
  }
};


export function getCoverImageUrl(cover) {
  if (!cover) return '';
  if (cover.startsWith('http://') || cover.startsWith('https://')) return cover;
  const base = import.meta.env.VITE_API_URL || '';
  const origin = base.replace(/\/marsai\/?$/, '') || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${origin}/${cover.replace(/^\//, '')}`;
}

export function getVideoFileUrl(videoFileName) {
  if (!videoFileName) return null;
  if (videoFileName.startsWith('http://') || videoFileName.startsWith('https://')) {
    return videoFileName;
  }
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const origin = base.replace(/\/marsai\/?$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const cleanFileName = videoFileName.replace(/^\//, '');
  // Les vidéos sont servies depuis /assets/uploads/videos/
  // Si le nom de fichier contient déjà "assets/uploads", l'utiliser tel quel
  if (cleanFileName.includes('assets/uploads')) {
    return `${origin}/${cleanFileName}`;
  }
  // Sinon, construire le chemin complet
  return `${origin}/assets/uploads/videos/${cleanFileName}`;
}